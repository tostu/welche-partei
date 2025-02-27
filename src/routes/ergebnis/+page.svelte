<script lang="ts">
	import { partyWeights } from '$lib/partyWeights';
	import { answerState } from '$lib/state.svelte';
	import { onMount } from 'svelte';
	import ChartBar from '$lib/components/ChartBar.svelte';
	import { parties, type Party, type PartyData } from '$lib/parties';
	import ResultStat from '$lib/components/ResultStat.svelte';

	import type { Answer, Category } from '$lib/categories';

	type PartyScores = Record<string, number>;
	type RankedParty = { party: PartyData; percentage: number };

	let bestMatch = $state<PartyData | null>(null);
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
					.map(([partyName, score]) => ({
						party: parties.find((p) => p.name === partyName)!,
						percentage: (score / maxScore) * 100
					}))
					.sort((a, b) => b.percentage - a.percentage)
			: [];
	}

	// Findet die Partei mit der höchsten Punktzahl
	function findBestMatch(scores: PartyScores): PartyData | null {
		const bestPartyName = Object.entries(scores).reduce(
			(best, [party, score]) => (score > best.score ? { party, score } : best),
			{ party: '', score: -Infinity }
		).party;

		return parties.find((p) => p.name === bestPartyName) ?? null;
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

<div class="min-h-ful mx-6 mt-6 flex w-full flex-col items-center gap-5 lg:mx-[200px] xl:mx-[20vw]">
	<div class="w-full rounded-md bg-base-200">
		<div class="mx-5 mt-5 flex flex-col items-center gap-3">
			<h1 class="text-4xl text-gray-700">Beste Übereinstimmung:</h1>
			{#if bestMatch}
				<img
					src={bestMatch.logo}
					alt={bestMatch.name}
					class="aspect-square rounded-md object-contain"
				/>
			{/if}
		</div>
	</div>

	<div role="tablist" class="tabs tabs-lifted w-full">
		<input
			type="radio"
			name="my_tabs_2"
			role="tab"
			class="tab bg-transparent"
			aria-label="Tab 1"
			checked="checked"
		/>

		<div role="tabpanel" class="tab-content h-[400px] rounded-box border-base-300 bg-base-200 p-6">
			<div class="mx-5 mt-5 flex h-full flex-col items-center gap-3">
				<!-- <h1 class="text-4xl text-gray-700">Interessante Fakten:</h1> -->
				<ChartBar />
			</div>
		</div>

		<input type="radio" name="my_tabs_2" role="tab" class="tab bg-transparent" aria-label="Tab 2" />
		<div role="tabpanel" class="tab-content h-[400px] rounded-box border-base-300 bg-base-200 p-6">
			Tab content 2
		</div>

		<input type="radio" name="my_tabs_2" role="tab" class="tab bg-transparent" aria-label="Tab 3" />
		<div role="tabpanel" class="tab-content h-[400px] rounded-box border-base-300 bg-base-200 p-6">
			Tab content 3
		</div>
	</div>

	<!-- <div class="w-full rounded-md bg-base-200">
		<div class="mx-5 mt-5 flex h-[400px] flex-col items-center gap-3">
			<h1 class="text-4xl text-gray-700">Interessante Fakten:</h1>
			<ChartBar />
		</div>
	</div> -->

	{#if showStats}
		<div class="flex h-full w-full flex-col gap-3">
			{#each normalizedScores as { party, percentage }, index}
				<ResultStat rank={index + 1} name={party.name} {percentage} />
			{/each}
		</div>
	{/if}
	<!-- <div class="flex h-[400px] w-full flex-col lg:flex-row"> -->
	<!-- <div class="card flex w-1/2 rounded-box bg-base-300">
			<div class="card-body">
				<h2 class="card-title">Beste Übereinstimmung</h2>
				<div class="flex h-full items-center">
					{#if bestMatch}
						<div class="h-full content-center">
							<img
								src={bestMatch.logo}
								alt={bestMatch.name}
								class="aspect-square rounded-md object-contain"
							/>
						</div>

						<h2 class="text-7xl">{bestMatch.name}</h2>
						<!-- <div>

							<p>If a dog chews shoes whose shoes does he choose?</p>
						</div> -->
	<!-- {/if}
				</div>
			</div>
		</div>
		<div class="divider lg:divider-horizontal"></div>
		<div class="card flex w-1/2 rounded-box bg-base-300">
			<div class="card-body">
				<h2 class="card-title">Shoes!</h2>

			</div>
		</div> -->
	<!-- </div> -->
</div>
