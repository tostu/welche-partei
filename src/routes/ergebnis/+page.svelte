<script lang="ts">
	import { partyWeights } from '$lib/partyWeights';
	import { answerState } from '$lib/state.svelte';
	import { onMount } from 'svelte';

	import ResultStat from '$lib/components/ResultStat.svelte';

	import type { Answer, Category } from '$lib/categories';

	type PartyScores = Record<string, number>;
	type RankedParty = { party: string; percentage: number };

	let bestMatch = $state('');
	let partyScores = $state<PartyScores>({});
	let normalizedScores = $state<RankedParty[]>([]);
	let showStats = $state(false);

	// Berechnet die Gesamtpunkte jeder Partei basierend auf den Antworten
	function calculatePartyScores(): PartyScores {
		return Object.entries(partyWeights).reduce((scores, [party, categories]) => {
			const totalScore = Object.entries(answerState.answerMap).reduce(
				(score, [category, answer]) => {
					const categoryWeights = categories[category as Category];
					const weight = categoryWeights?.[answer as Answer<Category>];
					return score + (weight ?? 0);
				},
				0
			);

			return { ...scores, [party]: totalScore };
		}, {});
	}

	// Berechnet die maximal erreichbare Punktzahl
	function calculateMaxScore(): number {
		return (
			Object.values(answerState.answerMap).filter((answer) => answer !== undefined).length * 10
		);
	}

	// Berechnet die Scores als Prozent des maximal erreichbaren Scores
	function normalizeScores(scores: PartyScores, maxScore: number): RankedParty[] {
		return maxScore > 0
			? Object.entries(scores)
					.map(([party, score]) => ({ party, percentage: (score / maxScore) * 100 }))
					.sort((a, b) => b.percentage - a.percentage) // Sort in descending order
			: [];
	}

	// Findet die Partei mit der höchsten Punktzahl
	function findBestMatch(scores: PartyScores): string {
		return Object.entries(scores).reduce(
			(best, [party, score]) => (score > best.score ? { party, score } : best),
			{ party: '', score: -Infinity }
		).party;
	}

	// Aktualisiert die Ergebnisse
	function updateResults() {
		partyScores = calculatePartyScores();
		const maxScore = calculateMaxScore();
		normalizedScores = normalizeScores(partyScores, maxScore);
		bestMatch = findBestMatch(partyScores);

		showStats = true;

		// Debugging-Logs
		console.log('Party Scores:', partyScores);
		console.log('Max Score:', maxScore);
		console.log('Normalized Scores:', normalizedScores);
		console.log('Best Match:', bestMatch);
	}

	// Initialisiert beim Laden der Komponente
	onMount(() => {
		updateResults();
	});
</script>

{#if showStats}
	<div class="container mx-auto flex w-full justify-center">
		<div class="flex h-full w-1/2 flex-col gap-3">
			{#each normalizedScores as { party, percentage }, index}
				<ResultStat rank={index + 1} name={party} {percentage} />
			{/each}
		</div>
	</div>
{/if}
