<script lang="ts">
	import { partyWeights } from '$lib/partyWeights';
	import { answerState } from '$lib/state.svelte';
	import { onMount } from 'svelte';

	import type { Answer, Category } from '$lib/categories';

	type PartyScores = Record<string, number>;

	let bestMatch = $state('');
	let partyScores = $state<PartyScores>({});
	let normalizedScores = $state<PartyScores>({});

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
	function normalizeScores(scores: PartyScores, maxScore: number): PartyScores {
		return maxScore > 0
			? Object.fromEntries(
					Object.entries(scores).map(([party, score]) => [party, (score / maxScore) * 100])
				)
			: scores;
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

{#if bestMatch}
	<div class="result">
		<h2>Best Match</h2>
		<p>{bestMatch}</p>

		<!-- Zeigt alle Partei-Scores als Prozent des maximal erreichbaren Scores -->
		<div class="scores">
			{#each Object.entries(normalizedScores) as [party, score]}
				<div class="score-item">
					<span>{party}:</span>
					<span>{score.toFixed(2)}%</span>
				</div>
			{/each}
		</div>
	</div>
{/if}
