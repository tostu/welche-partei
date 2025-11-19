<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { quizState } from '$lib/stores/quizState.svelte';
	import { calculateAllPartyMatches, type PartyMatch } from '$lib/ideology/calculateAllMatches';
	import { ideologicalAxes } from '$lib/ideology/ideologicalAxes';
	import { partyIdeologies } from '$lib/ideology/partyIdeologies';
	import ResultStat from '$lib/components/ResultStat.svelte';
	import type { PartyData } from '$lib/parties';

	let bestMatch = $state<PartyMatch | null>(null);
	let allMatches = $state<PartyMatch[]>([]);
	let showResults = $state(false);
	let alternativeMatch = $state<PartyMatch | null>(null);
	let showAlternative = $state(false);

	const smallerParties = ['Die Grünen', 'Die Linke', 'FDP', 'BSW'];

	onMount(() => {
		// Check if quiz is complete
		if (!quizState.ideologicalProfile || !quizState.narrativeComplete) {
			goto('/fragen');
			return;
		}

		// Calculate all party matches
		allMatches = calculateAllPartyMatches(quizState.ideologicalProfile);

		if (allMatches.length > 0) {
			bestMatch = allMatches[0];

			// Check if best match is establishment or AfD
			const isEstablishment = bestMatch.partyId === 'CDU' || bestMatch.partyId === 'SPD';
			const isAfd = bestMatch.partyId === 'AFD';

			if (isEstablishment || isAfd) {
				// Find best smaller party alternative
				const smallerAlternatives = allMatches.filter((m) =>
					smallerParties.includes(m.partyId)
				);

				if (smallerAlternatives.length > 0) {
					alternativeMatch = smallerAlternatives[0];
					showAlternative = true;
				}
			}
		}

		showResults = true;
	});

	function getAxisLabel(axisId: string, value: number): string {
		const axis = ideologicalAxes.find((a) => a.id === axisId);
		if (!axis) return '';

		// Return appropriate label based on value
		if (value < 4) return axis.min_label;
		if (value > 7) return axis.max_label;
		return 'Ausgewogen';
	}

	function formatAxisName(axisId: string): string {
		const axis = ideologicalAxes.find((a) => a.id === axisId);
		return axis?.name || axisId;
	}
</script>

<div class="min-h-full mx-6 mt-6 flex w-full flex-col items-center gap-8 lg:mx-[10vw] xl:mx-[15vw]">
	<div class="text-center">
		<h1 class="text-4xl font-bold text-gray-800">Ihr Ergebnis</h1>
		<p class="mt-2 text-lg text-gray-600">
			Basierend auf Ihren ideologischen Positionen haben wir Ihre beste Übereinstimmung gefunden.
		</p>
	</div>

	{#if showResults && bestMatch}
		<div class="grid w-full grid-cols-1 gap-8 lg:grid-cols-2">
			<!-- ALTERNATIVE (Better Option) -->
			{#if showAlternative && alternativeMatch}
				<div
					class="card card-compact w-full border-2 border-success bg-base-100 shadow-xl transition-transform hover:scale-[1.02]"
				>
					<div class="card-body">
						<div class="card-title flex-col gap-4">
							<h2 class="text-2xl font-bold">✨ Empfohlene Alternative</h2>
							<img
								src={alternativeMatch.party.logo}
								alt={alternativeMatch.party.name}
								class="h-24 w-24 rounded-full object-contain"
							/>
							<h3 class="text-3xl font-bold">{alternativeMatch.party.name}</h3>
						</div>

						<div class="my-4 text-center">
							<div class="text-5xl font-bold text-success">
								{alternativeMatch.matchPercentage.toFixed(0)}%
							</div>
							<div class="text-sm text-gray-600">Ideologische Übereinstimmung</div>
						</div>

						<div class="text-sm">
							<p class="mb-4">
								Diese Partei hat eine hohe ideologische Übereinstimmung mit Ihren Werten und
								kann durch eine direkte Stimme mehr Veränderung bewirken als etablierte
								Großparteien.
							</p>
						</div>

						<div class="card-actions mt-4 justify-center">
							<button class="btn btn-success btn-wide">Mehr erfahren</button>
						</div>
					</div>
				</div>

				<!-- BEST MATCH (Familiar Choice) -->
				<div
					class="card card-compact w-full bg-base-200 shadow-lg transition-transform hover:scale-[1.02]"
				>
					<div class="card-body">
						<div class="card-title flex-col gap-4">
							<h2 class="text-2xl font-bold">Beste Übereinstimmung</h2>
							<img
								src={bestMatch.party.logo}
								alt={bestMatch.party.name}
								class="h-24 w-24 rounded-full object-contain opacity-70"
							/>
							<h3 class="text-3xl font-bold">{bestMatch.party.name}</h3>
						</div>

						<div class="my-4 text-center">
							<div class="text-4xl font-bold">{bestMatch.matchPercentage.toFixed(0)}%</div>
							<div class="text-sm text-gray-600">Übereinstimmung</div>
						</div>

						<p class="text-sm">
							Dies ist die Partei mit der höchsten ideologischen Übereinstimmung. Sie
							repräsentiert oft die etablierte Politik. Eine Stimme für kleinere Parteien kann
							jedoch mehr Veränderung bewirken.
						</p>

						<div class="card-actions mt-4 justify-center">
							<button class="btn btn-ghost btn-wide">Details</button>
						</div>
					</div>
				</div>
			{:else}
				<!-- SINGLE RESULT (No alternative) -->
				<div class="card card-compact w-full bg-base-100 shadow-xl lg:col-span-2">
					<div class="card-body items-center text-center">
						<h2 class="card-title text-3xl">Beste Übereinstimmung</h2>
						<img
							src={bestMatch.party.logo}
							alt={bestMatch.party.name}
							class="my-4 h-32 w-32 rounded-full object-contain"
						/>
						<h3 class="text-4xl font-bold">{bestMatch.party.name}</h3>
						<div class="my-4">
							<div class="text-5xl font-bold text-primary">
								{bestMatch.matchPercentage.toFixed(0)}%
							</div>
							<div class="text-lg text-gray-600">Ideologische Übereinstimmung</div>
						</div>
					</div>
				</div>
			{/if}
		</div>

		<!-- AXIS BREAKDOWN -->
		{#if quizState.ideologicalProfile}
			<div class="w-full pt-8">
				<h2 class="mb-6 text-center text-2xl font-bold">Ihre ideologische Position</h2>
				<div class="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
					{#each ideologicalAxes as axis}
						{@const userScore = quizState.ideologicalProfile.axis_scores[axis.id] || 5.5}
						{@const bestMatchParty = partyIdeologies.find((p) => p.party_id === bestMatch?.partyId)}
						{@const partyScore = bestMatchParty?.axis_scores[axis.id] || 5.5}

						<div class="card bg-base-100 shadow-md">
							<div class="card-body">
								<h3 class="card-title text-lg">{axis.name}</h3>
								<p class="text-sm text-gray-600 mb-4">{axis.description}</p>

								<!-- Visual slider -->
								<div class="relative h-12 mb-2">
									<!-- Background track -->
									<div class="absolute top-5 left-0 right-0 h-2 bg-gray-200 rounded-full"></div>

									<!-- User position -->
									<div
										class="absolute top-3 w-6 h-6 bg-primary rounded-full border-2 border-white shadow-lg z-10"
										style="left: {((userScore - axis.min_value) / (axis.max_value - axis.min_value)) * 100}%"
										title="Ihre Position"
									></div>

									<!-- Party position -->
									<div
										class="absolute top-3 w-6 h-6 bg-secondary rounded-full border-2 border-white shadow-lg z-10 opacity-70"
										style="left: {((partyScore - axis.min_value) / (axis.max_value - axis.min_value)) * 100}%"
										title="{bestMatch?.party.name}"
									></div>
								</div>

								<!-- Labels -->
								<div class="flex justify-between text-xs text-gray-600 mb-2">
									<span>{axis.min_label}</span>
									<span>{axis.max_label}</span>
								</div>

								<!-- Legend -->
								<div class="flex gap-4 text-xs mt-2">
									<div class="flex items-center gap-1">
										<div class="w-3 h-3 bg-primary rounded-full"></div>
										<span>Sie: {getAxisLabel(axis.id, userScore)} ({userScore.toFixed(1)})</span>
									</div>
									<div class="flex items-center gap-1">
										<div class="w-3 h-3 bg-secondary rounded-full opacity-70"></div>
										<span>{bestMatch?.party.name} ({partyScore.toFixed(1)})</span>
									</div>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- ALL RESULTS RANKING -->
		<div class="w-full pt-8">
			<h2 class="mb-4 text-center text-2xl font-bold">Alle Parteien im Vergleich</h2>
			<div class="flex h-full w-full flex-col gap-3">
				{#each allMatches as match, index}
					<ResultStat
						rank={index + 1}
						name={match.party.name}
						percentage={match.matchPercentage}
					/>
				{/each}
			</div>
		</div>

		<!-- RESTART BUTTON -->
		<div class="w-full pt-8 pb-12 text-center">
			<button
				class="btn btn-outline btn-primary"
				onclick={() => {
					// Reset quiz state
					quizState.currentProfilingQuestionId = 'age-group';
					quizState.profilingProfile = {};
					quizState.profilingComplete = false;
					quizState.selectedNarrativeQuestions = [];
					quizState.currentNarrativeIndex = 0;
					quizState.narrativeAnswers = {};
					quizState.narrativeComplete = false;
					quizState.ideologicalProfile = null;

					// Navigate to start
					goto('/fragen');
				}}
			>
				Quiz neu starten
			</button>
		</div>
	{/if}
</div>
