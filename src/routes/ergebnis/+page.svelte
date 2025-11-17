<script lang="ts">
	import { partyWeights } from '$lib/partyWeights';
	import { answerState } from '$lib/state.svelte';
	import { onMount } from 'svelte';
	import { parties, type PartyData } from '$lib/parties';
	import ResultStat from '$lib/components/ResultStat.svelte';
	import { calculateTrustScore, calculateConsistencyScore, type Party } from '$lib/policyEvidence';

	import type { Answer, Category } from '$lib/categories';
	import OppositionReality from '$lib/components/OppositionReality.svelte';

	type PartyScores = Record<string, number>;
	type RankedParty = { party: PartyData; percentage: number };

	let bestMatch = $state<PartyData | null>(null);
	let partyScores = $state<PartyScores>({});
	let normalizedScores = $state<RankedParty[]>([]);
	let showStats = $state(false);
	let bestMatchPercentage = $state(0);
	let trustScore = $state<{
		rate: number;
		total: number;
		exceeded: number;
		partial: number;
		delayed: number;
		broken: number;
	} | null>(null);
	let consistencyScore = $state<{
		rate: number;
		total: number;
		maintained: number;
		strengthened: number;
		weakened: number;
		abandoned: number;
	} | null>(null);
	let showAlternative = $state(false);
	let bestAlternative = $state<
		(RankedParty & { consistencyScore?: number; isCoalition: boolean }) | null
	>(null);
	let showEstablishmentWarning = $state(false);
	let showAfdAlternative = $state(false);
	let topMatches = $state<string[]>([]);

	console.log(answerState.answerMap);

	// Define smaller parties (not establishment, not AfD)
	const smallerParties = ['Grüne', 'Die Linke', 'FDP', 'BSW'];

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

	function calculateTopMatches(partyName: string): string[] {
		const partyCategories = partyWeights[partyName as Party];
		if (!partyCategories) return [];

		const answeredCategories = Object.keys(answerState.answerMap) as Category[];

		return answeredCategories
			.map((category) => {
				const answer = answerState.answerMap[category];
				const weight = partyCategories[category]?.[answer as Answer<Category>] ?? 0;
				return { category, weight };
			})
			.sort((a, b) => b.weight - a.weight)
			.slice(0, 3)
			.map((item) => item.category);
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

		if (bestMatch && normalizedScores.length > 0) {
			bestMatchPercentage = normalizedScores[0].percentage;
		}

		if (bestMatch) {
			consistencyScore = calculateConsistencyScore(bestMatch.name as Party);

			if (bestMatch.name === 'CDU' || bestMatch.name === 'SPD') {
				trustScore = calculateTrustScore(bestMatch.name as Party);
			}

			const isEstablishment = bestMatch.name === 'CDU' || bestMatch.name === 'SPD';
			const isAfd = bestMatch.name === 'AfD';

			if (isEstablishment || isAfd) {
				const smallerPartyAlternatives = normalizedScores
					.filter((ranked) => smallerParties.includes(ranked.party.name))
					.map((ranked) => {
						const isCoalition = ranked.party.name === 'CDU' || ranked.party.name === 'SPD';
						const cs = calculateConsistencyScore(ranked.party.name as Party).rate;
						return {
							...ranked,
							consistencyScore: cs,
							isCoalition
						};
					})
					.sort((a, b) => {
						const scoreDiff = b.percentage - a.percentage;
						if (Math.abs(scoreDiff) > 5) return scoreDiff;
						return (b.consistencyScore || 0) - (a.consistencyScore || 0);
					});

				if (smallerPartyAlternatives.length > 0) {
					bestAlternative = smallerPartyAlternatives[0];
					showAlternative = true;
					topMatches = calculateTopMatches(bestAlternative.party.name);

					if (isEstablishment) {
						showEstablishmentWarning = true;
					} else if (isAfd) {
						showAfdAlternative = true;
					}
				}
			}
		}

		showStats = true;
	}

	onMount(() => {
		updateResults();
	});
</script>

<div class="min-h-ful mx-6 mt-6 flex w-full flex-col items-center gap-8 lg:mx-[10vw] xl:mx-[15vw]">
	<div class="text-center">
		<h1 class="text-4xl font-bold text-gray-800">Ihr Ergebnis</h1>
		<p class="mt-2 text-lg text-gray-600">
			Basierend auf Ihren Antworten haben wir zwei Wege für Sie identifiziert.
		</p>
	</div>

	{#if bestMatch}
		<div class="grid w-full grid-cols-1 gap-8 lg:grid-cols-2">
			<!-- PATH 1: BETTER ALTERNATIVE (Prioritized) -->
			{#if showAlternative && bestAlternative}
				<div
					class="card card-compact w-full border-2 border-success bg-base-100 shadow-xl transition-transform hover:scale-[1.02]"
				>
					<div class="card-body">
						<div class="card-title flex-col gap-4">
							<h2 class="text-2xl font-bold">✨ Bessere Alternative</h2>
							<img
								src={bestAlternative.party.logo}
								alt={bestAlternative.party.name}
								class="h-24 w-24 rounded-full object-contain"
							/>
							<h3 class="text-3xl font-bold">{bestAlternative.party.name}</h3>
						</div>

						<div class="my-4 flex justify-around text-center">
							<div>
								<div class="text-3xl font-bold text-primary">
									{bestAlternative.percentage.toFixed(0)}%
								</div>
								<div class="text-sm text-gray-600">Übereinstimmung</div>
							</div>
							{#if bestAlternative.consistencyScore}
								<div>
									<div class="text-3xl font-bold text-success">
										{bestAlternative.consistencyScore.toFixed(0)}%
									</div>
									<div class="text-sm text-gray-600">Positions-Treue</div>
								</div>
							{/if}
						</div>

						<div class="text-sm">
							<p class="mb-4">
								Diese Partei hat eine hohe Übereinstimmung mit Ihren Ansichten und zeigt eine höhere
								Verlässlichkeit in ihren Positionen.
							</p>
							<h4 class="font-bold">Ihre Top-Übereinstimmungen:</h4>
							<ul class="mt-2 list-inside list-disc space-y-1 text-xs">
								{#each topMatches as match}
									<li>{match}</li>
								{/each}
							</ul>
						</div>

						<div class="card-actions mt-4 justify-center">
							<button class="btn btn-success btn-wide">Mehr erfahren</button>
						</div>
					</div>
				</div>

				<!-- PATH 2: FAMILIAR CHOICE -->
				<div
					class="card card-compact w-full bg-base-200 shadow-lg transition-transform hover:scale-[1.02]"
				>
					<div class="card-body">
						<div class="card-title flex-col gap-4">
							<h2 class="text-2xl font-bold">Ihre gewohnte Wahl?</h2>
							<img
								src={bestMatch.logo}
								alt={bestMatch.name}
								class="h-24 w-24 rounded-full object-contain opacity-70"
							/>
							<h3 class="text-3xl font-bold">{bestMatch.name}</h3>
						</div>

						<div class="my-4 flex justify-around text-center">
							<div>
								<div class="text-3xl font-bold">{bestMatchPercentage.toFixed(0)}%</div>
								<div class="text-sm text-gray-600">Übereinstimmung</div>
							</div>
							{#if consistencyScore}
								<div>
									<div class="text-3xl font-bold">{consistencyScore.rate.toFixed(0)}%</div>
									<div class="text-sm text-gray-600">Positions-Treue</div>
								</div>
							{/if}
						</div>

						<p class="text-sm">
							Dies ist die Partei mit der höchsten Übereinstimmung in Ihren Antworten. Sie
							repräsentiert oft die etablierte Politik. Eine Stimme für kleinere Parteien kann
							jedoch mehr Veränderung bewirken.
						</p>

						<div class="card-actions mt-4 justify-center">
							<button class="btn btn-ghost btn-wide">Details</button>
						</div>
					</div>
				</div>
			{:else}
				<!-- SINGLE RESULT VIEW (No alternative shown) -->
				<div class="card card-compact w-full bg-base-100 shadow-xl lg:col-span-2">
					<div class="card-body items-center text-center">
						<h2 class="card-title text-3xl">Beste Übereinstimmung</h2>
						<img
							src={bestMatch.logo}
							alt={bestMatch.name}
							class="my-4 h-32 w-32 rounded-full object-contain"
						/>
						<h3 class="text-4xl font-bold">{bestMatch.name}</h3>
						<div class="my-4">
							<div class="text-5xl font-bold text-primary">{bestMatchPercentage.toFixed(0)}%</div>
							<div class="text-lg text-gray-600">Übereinstimmung</div>
						</div>
						{#if !['CDU', 'SPD'].includes(bestMatch.name)}
							<div class="w-full max-w-md">
								<OppositionReality
									matchedParty={bestMatch.name as Party}
									matchScore={bestMatchPercentage}
								/>
							</div>
						{/if}
					</div>
				</div>
			{/if}
		</div>
	{/if}

	{#if showStats}
		<div class="w-full pt-8">
			<h2 class="mb-4 text-center text-2xl font-bold">Alle Ergebnisse im Überblick</h2>
			<div class="flex h-full w-full flex-col gap-3">
				{#each normalizedScores as { party, percentage }, index}
					<ResultStat rank={index + 1} name={party.name} {percentage} />
				{/each}
			</div>
		</div>
	{/if}
</div>
