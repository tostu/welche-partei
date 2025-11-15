<script lang="ts">
	import { partyWeights } from '$lib/partyWeights';
	import { answerState } from '$lib/state.svelte';
	import { onMount } from 'svelte';
	import ChartBar from '$lib/components/ChartBar.svelte';
	import { parties, type PartyData } from '$lib/parties';
	import ResultStat from '$lib/components/ResultStat.svelte';
	import { daten } from '$lib/programs/taxes';
	import PromiseTimeline from '$lib/components/PromiseTimeline.svelte';
	import EvidenceCard from '$lib/components/EvidenceCard.svelte';
	import OppositionReality from '$lib/components/OppositionReality.svelte';
	import { calculateTrustScore, calculateConsistencyScore, type Party } from '$lib/policyEvidence';

	import type { Answer, Category } from '$lib/categories';

	type PartyScores = Record<string, number>;
	type RankedParty = { party: PartyData; percentage: number };

	let bestMatch = $state<PartyData | null>(null);
	let partyScores = $state<PartyScores>({});
	let normalizedScores = $state<RankedParty[]>([]);
	let showStats = $state(false);
	let bestMatchPercentage = $state(0);
	let trustScore = $state<{ rate: number; total: number; exceeded: number; partial: number; delayed: number; broken: number } | null>(null);
	let consistencyScore = $state<{ rate: number; total: number; maintained: number; strengthened: number; weakened: number; abandoned: number } | null>(null);
	let showAlternative = $state(false);
	let bestAlternative = $state<(RankedParty & { consistencyScore?: number; isCoalition: boolean }) | null>(null);
	let showEstablishmentWarning = $state(false);
	let showAfdAlternative = $state(false);

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

		// Calculate best match percentage
		if (bestMatch && normalizedScores.length > 0) {
			bestMatchPercentage = normalizedScores[0].percentage;
		}

		// Calculate consistency score for ALL parties (shows position-treue)
		if (bestMatch) {
			consistencyScore = calculateConsistencyScore(bestMatch.name as Party);

			// Calculate trust score for coalition parties
			if (bestMatch.name === 'CDU' || bestMatch.name === 'SPD') {
				trustScore = calculateTrustScore(bestMatch.name as Party);
			}

			// NEW LOGIC: Show alternative if match is CDU/SPD/AfD
			const isEstablishment = bestMatch.name === 'CDU' || bestMatch.name === 'SPD';
			const isAfd = bestMatch.name === 'AfD';

			if (isEstablishment || isAfd) {
				// Find best alternative from smaller parties
				const smallerPartyAlternatives = normalizedScores
					.filter(ranked => smallerParties.includes(ranked.party.name))
					.map(ranked => {
						const isCoalition = ranked.party.name === 'CDU' || ranked.party.name === 'SPD';
						const cs = calculateConsistencyScore(ranked.party.name as Party).rate;
						return {
							...ranked,
							consistencyScore: cs,
							isCoalition
						};
					})
					.sort((a, b) => {
						// Prioritize by match percentage first, then consistency
						const scoreDiff = b.percentage - a.percentage;
						if (Math.abs(scoreDiff) > 5) return scoreDiff;
						return (b.consistencyScore || 0) - (a.consistencyScore || 0);
					});

				if (smallerPartyAlternatives.length > 0) {
					bestAlternative = smallerPartyAlternatives[0];
					showAlternative = true;

					if (isEstablishment) {
						showEstablishmentWarning = true;
					} else if (isAfd) {
						showAfdAlternative = true;
					}
				}
			}
		}

		showStats = true;

		// Debugging-Logs
		console.log('Party Scores:', partyScores);
		console.log('Max Score:', maxScore);
		console.log('Normalized Scores:', normalizedScores);
		console.log('Best Match:', bestMatch);
		console.log('Trust Score:', trustScore);
		console.log('Show Alternatives:', showAlternatives);
		console.log('Alternative Parties:', alternativeParties);
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
					class="my-8 h-auto max-h-[100px] w-auto max-w-full rounded-md object-contain sm:max-h-[250px] md:max-h-[150px] lg:max-h-[200px]"
				/>
			{/if}
		</div>
	</div>

	<!-- Opposition Reality Check -->
	{#if bestMatch && !['CDU', 'SPD'].includes(bestMatch.name)}
		<div class="w-full">
			<OppositionReality matchedParty={bestMatch.name as Party} matchScore={bestMatchPercentage} />
		</div>
	{/if}

	<!-- ESTABLISHMENT WARNING: CDU/SPD have failed -->
	{#if showEstablishmentWarning && trustScore}
		<div class="alert alert-error w-full shadow-lg">
			<div class="flex w-full flex-col gap-3">
				<div class="flex items-center gap-2">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
					</svg>
					<h3 class="font-bold">⚠️ Die Große Koalition hat versagt</h3>
				</div>
				<div class="text-sm">
					<p class="mb-2"><strong>CDU und SPD regieren seit Jahren</strong> – aber die Probleme bleiben:</p>
					<ul class="ml-5 list-disc space-y-1">
						<li><strong>{trustScore.broken} von {trustScore.total} Versprechen gebrochen</strong> ({((trustScore.broken / trustScore.total) * 100).toFixed(0)}%)</li>
						<li>Nur {trustScore.rate.toFixed(0)}% Erfüllungsquote – Mehrheit der Zusagen nicht eingehalten</li>
						<li>Seit 2005 an der Macht, aber Wohnungsnot, Pflegemangel, Bildungskrise bleiben ungelöst</li>
					</ul>
					<p class="mt-3 font-bold">💡 Zeit für frischen Wind: Kleinere Parteien können echte Veränderung bringen!</p>
				</div>
			</div>
		</div>
	{/if}

	<!-- SINGLE ALTERNATIVE RECOMMENDATION -->
	{#if showAlternative && bestAlternative}
		<div class="alert {showEstablishmentWarning ? 'alert-success' : 'alert-info'} w-full shadow-lg">
			<div class="flex w-full flex-col gap-3">
				<div class="flex items-center gap-2">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<h3 class="font-bold">
						{#if showEstablishmentWarning}
							✨ Bessere Alternative: Stimmt zu {bestAlternative.percentage.toFixed(0)}% mit Ihnen überein
						{:else if showAfdAlternative}
							💡 Weitere Partei die zu Ihnen passt
						{/if}
					</h3>
				</div>
				<div class="text-sm">
					{#if showEstablishmentWarning}
						<p class="mb-3">
							<strong>Kleinere Parteien können Veränderung bringen!</strong> Sie haben oft klarere Positionen und mehr Druck, ihre Versprechen einzuhalten.
						</p>
					{:else if showAfdAlternative}
						<p class="mb-3">
							Hier ist eine Partei, die ebenfalls gut zu Ihren Ansichten passt:
						</p>
					{/if}

					<div class="rounded-lg border-2 {bestAlternative.consistencyScore && bestAlternative.consistencyScore > (consistencyScore?.rate || 0) ? 'border-success' : 'border-primary'} bg-base-100 p-4">
						<div class="flex items-center gap-4">
							<img src={bestAlternative.party.logo} alt={bestAlternative.party.name} class="h-16 w-16 rounded object-contain" />
							<div class="flex-1">
								<div class="mb-2 flex items-center gap-2">
									<h4 class="text-xl font-bold">{bestAlternative.party.name}</h4>
									{#if bestAlternative.consistencyScore && bestAlternative.consistencyScore > (consistencyScore?.rate || 0)}
										<span class="badge badge-success">⭐ Höhere Positions-Treue</span>
									{/if}
								</div>
								<div class="flex items-center gap-4 text-sm">
									<span class="font-semibold text-primary">
										📊 {bestAlternative.percentage.toFixed(0)}% Übereinstimmung mit Ihren Ansichten
									</span>
									{#if bestAlternative.consistencyScore && bestAlternative.consistencyScore > 0}
										<span class="font-semibold text-success">
											✓ {bestAlternative.consistencyScore.toFixed(0)}% Positions-Treue
										</span>
									{/if}
								</div>
								{#if bestAlternative.percentage > bestMatchPercentage - 5}
									<p class="mt-2 text-xs text-gray-600">
										💡 Fast genauso gute Übereinstimmung wie {bestMatch?.name}, aber möglicherweise besser für echte Veränderung!
									</p>
								{/if}
							</div>
						</div>
					</div>

					<div class="mt-3 rounded-lg bg-base-200 p-3">
						<p class="text-xs">
							<strong>💡 Warum kleinere Parteien?</strong> Sie stehen oft klarer zu ihren Positionen und haben mehr Druck, Versprechen einzuhalten. Je mehr Menschen sie wählen, desto mehr Verhandlungsmacht für echte Veränderung!</p>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<div role="tablist" class="tabs tabs-lifted w-full">
		<input
			type="radio"
			name="my_tabs_2"
			role="tab"
			class="tab bg-transparent"
			aria-label="Tab 1"
			checked="checked"
		/>

		<div role="tabpanel" class="tab-content h-[500px] rounded-box border-base-300 bg-base-200 p-6">
			<div class="mx-5 mt-5 flex h-full flex-col items-center gap-3">
				<h2 class="mb-2 text-2xl text-gray-700">Steuerliche Auswirkungen nach Parteiprogramm</h2>
				<p class="mb-4 text-sm text-gray-600">
					Jährliche Veränderung in Euro für {daten.haushaltstyp}
				</p>
				<ChartBar />
			</div>
		</div>

		<input type="radio" name="my_tabs_2" role="tab" class="tab bg-transparent" aria-label="Versprechen vs Realität" />
		<div role="tabpanel" class="tab-content min-h-[500px] overflow-auto rounded-box border-base-300 bg-base-200 p-6">
			{#if bestMatch && ['CDU', 'SPD'].includes(bestMatch.name)}
				<PromiseTimeline party={bestMatch.name as Party} highlightCategories={Object.keys(answerState.answerMap)} />
			{:else}
				<div class="flex h-full items-center justify-center">
					<p class="text-center text-gray-500">Versprechen-Tracking ist nur für Regierungsparteien (CDU/SPD) verfügbar.</p>
				</div>
			{/if}
		</div>

		<input type="radio" name="my_tabs_2" role="tab" class="tab bg-transparent" aria-label="Beweise nach Thema" />
		<div role="tabpanel" class="tab-content min-h-[500px] overflow-auto rounded-box border-base-300 bg-base-200 p-6">
			<div class="flex flex-col gap-6">
				<h2 class="text-2xl font-bold text-gray-700">Beweise nach Thema</h2>
				<p class="text-sm text-gray-600">Konkrete Daten zu den Themen, die Sie beantwortet haben</p>

				{#each Object.entries(answerState.answerMap) as [category, answer]}
					{#if answer !== undefined}
						<EvidenceCard category={category as Category} userAnswer={answer} />
					{/if}
				{/each}
			</div>
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
