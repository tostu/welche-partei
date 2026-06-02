<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { quizState, resetQuiz, saveQuizState } from '$lib/stores/quizState.svelte';
	import {
		calculateAllPartyMatches,
		calculateChoiceImpacts,
		type PartyMatch,
		type ChoiceImpact
	} from '$lib/ideology/calculateAllMatches';
	import { ideologicalAxes } from '$lib/ideology/ideologicalAxes';
	import { partyIdeologies } from '$lib/ideology/partyIdeologies';
	import ResultStat from '$lib/components/ResultStat.svelte';
	import { parties } from '$lib/parties';
	import { realityChecks, calculatePartyPenalty } from '$lib/ideology/realityChecks';
	import { profilingQuestions } from '$lib/profiling/questions';

	let allMatches = $state<PartyMatch[]>([]);
	let showResults = $state(false);
	let choiceImpacts = $state<ChoiceImpact[]>([]);
	let openQuestions = $state<Record<number, boolean>>({});

	let selectedPartyId = $state<string>('');
	let activeTab = $state<'comparison' | 'haertetest' | 'impact'>('comparison');

	// Set initial selected party to the best match when available
	$effect(() => {
		if (showResults && !selectedPartyId && adjustedMatches.length > 0) {
			selectedPartyId = adjustedMatches[0].partyId;
		}
	});

	// Select statements for the selected party
	let selectedStatements = $derived(realityChecks.filter((s) => s.partyId === selectedPartyId));

	// Select ideology profile for the selected party
	let selectedPartyIdeology = $derived(partyIdeologies.find((p) => p.party_id === selectedPartyId));

	// Debug display state
	let showDebug = $state(false);

	let debugProfilingAnswers = $derived.by(() => {
		if (!quizState.profilingProfile) return [];
		return Object.entries(quizState.profilingProfile).map(([qId, val]) => {
			const question = profilingQuestions.find((q) => q.id === qId);
			const answer = question?.answers?.find((a) => a.value === val);
			
			// For sliders and budget allocations, construct a nice readable string
			let answerText = answer?.text || '';
			if (!answerText) {
				if (typeof val === 'number') {
					answerText = `${val}%`;
				} else if (val && typeof val === 'object') {
					answerText = Object.entries(val)
						.map(([optId, points]) => `${optId}: ${points}`)
						.join(', ');
				} else {
					answerText = String(val);
				}
			}

			return {
				id: qId,
				questionText: question?.text || qId,
				val: typeof val === 'object' ? JSON.stringify(val) : val,
				answerText
			};
		});
	});

	let debugHaertetestAnswers = $derived.by(() => {
		if (!quizState.haertetestAnswers) return [];
		return Object.entries(quizState.haertetestAnswers).map(([stmtId, val]) => {
			const statement = realityChecks.find((s) => s.id === stmtId);
			return {
				id: stmtId,
				statementText: statement?.text || stmtId,
				partyId: statement?.partyId || '',
				val,
				penalty: statement?.penalty || 0,
				partyStance: statement?.partyStance || ''
			};
		});
	});

	// Dynamic position check state
	let openExplanations = $state<Record<string, boolean>>({});

	function toggleQuestion(questionId: number) {
		openQuestions[questionId] = !openQuestions[questionId];
	}

	function toggleExplanation(stmtId: string) {
		openExplanations[stmtId] = !openExplanations[stmtId];
	}

	const smallerParties = [
		'Die Grünen',
		'Die Linke',
		'FDP',
		'BSW',
		'Volt',
		'Freie Wähler',
		'Tierschutzpartei',
		'ÖDP',
		'Piratenpartei'
	];

	// Derived adjusted matches
	let adjustedMatches = $derived.by(() => {
		const matches = allMatches.map((match) => {
			// Traditional penalties (optional, keep for depth or disable)
			const penalty = calculatePartyPenalty(match.partyId, quizState.haertetestAnswers);
			
			return {
				...match,
				matchPercentage: Math.min(100, Math.max(0, match.matchPercentage - penalty)),
				basePercentage: match.matchPercentage,
				penalty,
				bonus: 0
			};
		});
		return matches.sort((a, b) => b.matchPercentage - a.matchPercentage);
	});

	let bestMatch = $derived(adjustedMatches[0] || null);

	// Select the match data for the selected party
	let selectedMatch = $derived(adjustedMatches.find((m) => m.partyId === selectedPartyId) || null);

	let alternativeMatch = $derived.by(() => {
		if (!bestMatch) return null;
		const isEstablishment = bestMatch.partyId === 'CDU' || bestMatch.partyId === 'SPD';
		const isAfd = bestMatch.partyId === 'AFD';

		if (isEstablishment || isAfd) {
			const smallerAlternatives = adjustedMatches.filter((m) => smallerParties.includes(m.partyId));
			return smallerAlternatives[0] || null;
		}
		return null;
	});

	let showAlternative = $derived(alternativeMatch !== null);

	onMount(() => {
		// Check if quiz is complete
		if (!quizState.ideologicalProfile || !quizState.narrativeComplete) {
			goto('/fragen');
			return;
		}

		// Calculate all party matches
		allMatches = calculateAllPartyMatches(
			quizState.ideologicalProfile,
			partyIdeologies,
			quizState.profilingProfile
		);

		// Calculate choice impacts
		choiceImpacts = calculateChoiceImpacts(
			quizState.narrativeAnswers,
			quizState.selectedNarrativeQuestions,
			quizState.profilingProfile
		);

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
</script><div class="mx-6 mt-6 flex min-h-full w-full flex-col items-center gap-8 lg:mx-[10vw] xl:mx-[15vw]">
	<div class="text-center">
		<h1 class="text-4xl font-bold text-base-content">Ihr Ergebnis</h1>
		<p class="mt-2 text-lg text-base-content/85">
			Basierend auf Ihren ideologischen Positionen haben wir Ihre beste Übereinstimmung gefunden.
		</p>
		<button
			class="btn btn-outline btn-sm mt-4 text-base-content border-base-content/30 hover:bg-base-content/10"
			onclick={() => {
				resetQuiz();
				goto('/fragen');
			}}
		>
			Quiz neu starten
		</button>
	</div>

	{#if showResults && bestMatch}
		<div class="grid w-full grid-cols-1 gap-8 lg:grid-cols-2">
			<!-- ALTERNATIVE (Better Option) -->
			{#if showAlternative && alternativeMatch}
				<div
					class="card card-compact w-full border-2 border-success bg-base-150 shadow-xl transition-transform hover:scale-[1.02]"
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
							<div class="flex items-center justify-center gap-2 text-5xl font-bold text-success">
								{alternativeMatch.matchPercentage.toFixed(0)}%
								<div class="flex flex-col gap-1">
									{#if alternativeMatch.penalty > 0}
										<span class="badge badge-error badge-sm text-[10px] text-white"
											>-{alternativeMatch.penalty}% Abzug</span
										>
									{/if}
								</div>
							</div>
							<div class="text-sm text-base-content/70">Ideologische Übereinstimmung</div>
						</div>

						<div class="text-sm">
							<p class="mb-4">
								Diese Partei hat eine hohe ideologische Übereinstimmung mit Ihren Werten und kann
								durch eine direkte Stimme mehr Veränderung bewirken als etablierte Großparteien.
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
							<div class="flex items-center justify-center gap-2 text-4xl font-bold">
								{bestMatch.matchPercentage.toFixed(0)}%
								<div class="flex flex-col gap-1">
									{#if bestMatch.penalty > 0}
										<span class="badge badge-error badge-sm text-[10px] text-white"
											>-{bestMatch.penalty}% Abzug</span
										>
									{/if}
								</div>
							</div>
							<div class="text-sm text-base-content/70">Übereinstimmung</div>
						</div>

						<p class="text-sm">
							Dies ist die Partei mit der höchsten ideologischen Übereinstimmung. Sie repräsentiert
							oft die etablierte Politik. Eine Stimme für kleinere Parteien kann jedoch mehr
							Veränderung bewirken.
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
							<div class="flex items-center justify-center gap-2 text-5xl font-bold text-primary">
								{bestMatch.matchPercentage.toFixed(0)}%
								<div class="flex flex-col gap-1">
									{#if bestMatch.penalty > 0}
										<span class="badge badge-error badge-sm text-[10px] text-white"
											>-{bestMatch.penalty}% Abzug</span
										>
									{/if}
								</div>
							</div>
							<div class="text-lg text-base-content/70">Ideologische Übereinstimmung</div>
						</div>
					</div>
				</div>
			{/if}
		</div>

		<!-- INTERACTIVE RESULTS DASHBOARD -->
		<div class="grid w-full grid-cols-1 gap-8 lg:grid-cols-12 pt-4">
			<!-- LEFT PANEL: Alle Parteien im Vergleich -->
			<div class="flex flex-col gap-4 lg:col-span-4">
				<div class="rounded-2xl border border-base-300/40 bg-base-250 p-6 shadow-md">
					<h2 class="text-xl font-black text-base-content">Alle Parteien im Vergleich</h2>
					<p class="text-xs text-base-content/70 mt-1">Wählen Sie eine Partei, um Details anzuzeigen</p>
					
					<div class="mt-6 flex flex-col gap-3">
						{#each adjustedMatches as match, index}
							{@const isSelected = selectedPartyId === match.partyId}
							<button
								onclick={() => selectedPartyId = match.partyId}
								class="flex w-full items-center justify-between gap-4 rounded-xl border-2 p-4 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 {isSelected 
									? 'border-primary bg-base-200/50 shadow-lg shadow-primary/5 scale-[1.01]' 
									: 'border-base-300/20 bg-base-200 hover:border-base-300/40 hover:bg-base-200/80 hover:shadow-sm'}"
							>
								<div class="flex items-center gap-3 min-w-0">
									<span class="font-azeret shrink-0 text-xl font-bold text-base-content/60 select-none">
										{(index + 1).toString().padStart(2, '0')}
									</span>
									{#if match.party.logo}
										<img
											src={match.party.logo}
											alt={match.party.name}
											class="h-9 w-9 rounded-full bg-white border border-base-300/30 object-contain p-0.5"
										/>
									{/if}
									<div class="min-w-0">
										<div class="font-bold text-base-content text-base flex flex-wrap items-center gap-1.5 leading-tight">
											<span class="truncate">{match.party.name}</span>
											{#if match.penalty > 0}
												<span class="badge badge-error badge-xs py-1.5 text-[8px] font-bold text-white uppercase tracking-wider shrink-0">
													-{match.penalty.toFixed(0)}%
												</span>
											{/if}
										</div>
										<div class="text-[10px] text-base-content/60 mt-0.5">Rang {index + 1}</div>
									</div>
								</div>
								<div class="text-right shrink-0">
									<div class="text-xl font-black text-primary font-mono">{match.matchPercentage.toFixed(0)}%</div>
									{#if match.penalty > 0 && match.basePercentage !== undefined}
										<div class="text-[10px] text-base-content/50 line-through font-mono leading-none mt-0.5">
											{match.basePercentage.toFixed(0)}%
										</div>
									{/if}
								</div>
							</button>
						{/each}
					</div>
				</div>
			</div>

			<!-- RIGHT PANEL: Party Details, Werte-Vergleich, Positionen-Check, Einfluss -->
			<div class="flex flex-col gap-4 lg:col-span-8">
				{#if selectedMatch}
					<div class="card w-full border border-base-300/40 bg-base-200 shadow-md overflow-hidden">
						<!-- Header -->
						<div class="bg-base-300/20 p-6 flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-base-300/40">
							<div class="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
								{#if selectedMatch.party.logo}
									<img
										src={selectedMatch.party.logo}
										alt={selectedMatch.party.name}
										class="h-16 w-16 rounded-full border-2 border-white bg-white object-contain p-1 shadow-sm"
									/>
								{/if}
								<div>
									<h2 class="text-2xl font-black text-base-content">{selectedMatch.party.name}</h2>
									<p class="text-xs text-base-content/60 mt-0.5">Rang {adjustedMatches.findIndex(m => m.partyId === selectedPartyId) + 1}</p>
								</div>
							</div>
							<div class="text-center sm:text-right shrink-0">
								<div class="text-4xl font-black text-primary font-mono leading-none">
									{selectedMatch.matchPercentage.toFixed(0)}%
								</div>
								<div class="text-[10px] font-bold text-base-content/75 uppercase tracking-wider mt-1.5">Übereinstimmung</div>
								<div class="mt-1.5 flex flex-wrap items-center justify-center sm:justify-end gap-1.5">
									{#if selectedMatch.penalty > 0}
										<span class="badge badge-error badge-sm text-[10px] text-white font-bold">-{selectedMatch.penalty.toFixed(0)}% Abzug</span>
									{/if}
									{#if selectedMatch.basePercentage !== undefined && selectedMatch.penalty > 0}
										<span class="text-xs text-base-content/50 line-through font-mono">Basis: {selectedMatch.basePercentage.toFixed(0)}%</span>
									{/if}
								</div>
							</div>
						</div>

						<!-- Tabbed Navigation -->
						<div class="tabs tabs-lifted w-full px-6 pt-3 bg-base-200 border-b border-base-300/40">
							<button 
								class="tab tab-md font-bold transition-all {activeTab === 'comparison' ? 'tab-active [--tab-bg:var(--fallback-b1,oklch(var(--b1)))] text-primary' : 'text-base-content/70 hover:text-base-content'}"
								onclick={() => activeTab = 'comparison'}
							>
								📊 Werte
							</button>
							<button 
								class="tab tab-md font-bold transition-all {activeTab === 'impact' ? 'tab-active [--tab-bg:var(--fallback-b1,oklch(var(--b1)))] text-primary' : 'text-base-content/70 hover:text-base-content'}"
								onclick={() => activeTab = 'impact'}
							>
								⚡️ Wahl-Einfluss
							</button>
						</div>

						<!-- Tab Content -->
						<div class="p-6">
							{#if activeTab === 'comparison'}
								<!-- TAB 1: VALUES COMPARISON -->
								<div class="space-y-6">
									<div class="text-xs text-base-content/80 leading-relaxed">
										Vergleichen Sie Ihre Position auf den vier ideologischen Grundachsen direkt mit der 
										<span class="font-bold text-base-content">{selectedMatch.party.name}</span>. Der Prozentwert ergibt sich aus der Gesamtdistanz aller Achsenwerte.
									</div>

									<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
										{#each ideologicalAxes as axis}
											{@const userScore = quizState.ideologicalProfile?.axis_scores[axis.id] || 5.5}
											{@const partyScore = selectedPartyIdeology?.axis_scores[axis.id] || 5.5}

											<div class="rounded-xl border border-base-300/40 bg-base-300/20 p-4 shadow-xs">
												<h3 class="font-bold text-base-content text-sm">{axis.name}</h3>
												<p class="text-[11px] text-base-content/70 mt-0.5 mb-3 leading-snug">{axis.description}</p>

												<!-- Visual slider -->
												<div class="relative mb-2 h-10">
													<!-- Background track -->
													<div class="absolute left-0 right-0 top-4 h-2 rounded-full bg-base-300/60"></div>

													<!-- User position -->
													<div
														class="absolute top-2.5 z-10 h-5 w-5 rounded-full border-2 border-white bg-primary shadow-sm cursor-help hover:scale-105 transition-transform"
														style="left: {((userScore - axis.min_value) / (axis.max_value - axis.min_value)) * 100}%; transform: translateX(-50%)"
														title="Ihre Position: {userScore.toFixed(1)}"
													></div>

													<!-- Party position -->
													<div
														class="absolute top-2.5 z-10 h-5 w-5 rounded-full border-2 border-white bg-secondary opacity-80 shadow-sm cursor-help hover:scale-105 transition-transform"
														style="left: {((partyScore - axis.min_value) / (axis.max_value - axis.min_value)) * 100}%; transform: translateX(-50%)"
														title="{selectedMatch.party.name}: {partyScore.toFixed(1)}"
													></div>
												</div>

												<!-- Labels -->
												<div class="mb-3 flex justify-between text-[10px] font-semibold text-base-content/60">
													<span>{axis.min_label}</span>
													<span>{axis.max_label}</span>
												</div>

												<!-- Legend -->
												<div class="flex flex-col gap-1.5 text-[11px] pt-2 border-t border-base-300/40">
													<div class="flex items-center gap-1.5">
														<div class="h-2 w-2 rounded-full bg-primary"></div>
														<span class="text-base-content/70">Sie: <span class="font-bold text-base-content">{getAxisLabel(axis.id, userScore)} ({userScore.toFixed(1)})</span></span>
													</div>
													<div class="flex items-center gap-1.5">
														<div class="h-2 w-2 rounded-full bg-secondary opacity-80"></div>
														<span class="text-base-content/70">{selectedMatch.party.name}: <span class="font-bold text-base-content">{getAxisLabel(axis.id, partyScore)} ({partyScore.toFixed(1)})</span></span>
													</div>
												</div>
											</div>
										{/each}
									</div>
								</div>
							{:else if activeTab === 'impact'}
								{@const selectedPartyName = selectedMatch.party.name}
								<!-- TAB 3: CHOICE IMPACT -->
									<div class="space-y-6">
										<div class="text-xs text-base-content/85 leading-relaxed">
											Sehen Sie, wie sich Ihre Antworten bei den einzelnen Dilemma-Fragen im Vergleich zur Alternativ-Option auf die Übereinstimmung mit der 
											<span class="font-bold text-base-content">{selectedPartyName}</span> ausgewirkt haben.
										</div>

										<div class="flex flex-col gap-4">
											{#each choiceImpacts as impact}
												{@const question = quizState.selectedNarrativeQuestions.find((q) => q.id === impact.questionId)}
												{@const selectedEffect = impact.partyMatchEffects.find((e) => e.partyId === selectedPartyId)}
												{@const absDelta = selectedEffect ? Math.abs(selectedEffect.deltaPercentage) : 0}
												{@const isPositive = selectedEffect && selectedEffect.deltaPercentage >= 0}
												{@const hasEffect = selectedEffect && absDelta >= 0.01}

												<div class="collapse collapse-arrow overflow-hidden rounded-xl border border-base-300/40 bg-base-200 shadow-xs {openQuestions[impact.questionId] ? 'collapse-open' : ''}">
													<!-- Header -->
													<div
														role="button"
														tabindex="0"
														onclick={() => toggleQuestion(impact.questionId)}
														onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleQuestion(impact.questionId)}
														class="collapse-title flex cursor-pointer select-none flex-col justify-between gap-3 py-4 pr-12 text-sm font-semibold md:flex-row md:items-center"
													>
														<div class="flex-1 min-w-0 pr-2">
															<span class="mb-1 block text-[9px] font-bold uppercase tracking-wider text-primary">Frage {impact.questionId}</span>
															<span class="text-base-content text-sm leading-snug font-bold">{impact.storyText}</span>
														</div>

														<div class="flex flex-wrap items-center gap-2 shrink-0">
															{#if hasEffect && selectedEffect}
																<span class="font-mono text-[11px] font-bold rounded-lg px-2 py-1 border text-center {isPositive 
																	? 'border-green-200 bg-green-50 text-green-700' 
																	: 'border-red-200 bg-red-50 text-red-700'}">
																	{isPositive ? '+' : ''}{selectedEffect.deltaPercentage.toFixed(1)}%
																</span>
															{:else}
																<span class="font-mono text-[11px] font-semibold rounded-lg px-2 py-1 border border-base-300/40 bg-base-300/20 text-base-content/60 text-center">
																	Kein Einfluss
																</span>
															{/if}
														</div>
													</div>

													<!-- Content -->
													<div class="bg-base-300/10 collapse-content border-t border-base-300/30 pt-4">
														<div class="grid grid-cols-1 gap-4 pb-2 pt-2 lg:grid-cols-2">
															<!-- Options -->
															<div>
																<h4 class="mb-2 text-[10px] font-bold uppercase tracking-wider text-base-content/70">Optionen & Ihre Entscheidung</h4>
																<div class="space-y-2 text-xs">
																	<!-- Option A -->
																	<div class="rounded-xl border-2 p-3 {impact.chosenOption.letter === 'A' 
																		? 'border-primary bg-primary/5 text-base-content font-semibold shadow-xs' 
																		: 'border-base-300/20 bg-base-200 text-base-content/50'}">
																		<div class="flex items-start justify-between gap-2">
																			<div>
																				<span class="font-bold {impact.chosenOption.letter === 'A' ? 'text-primary' : 'text-base-content/60'}">A:</span>
																				<span>{question?.optionA?.text || (impact.chosenOption.letter === 'A' ? impact.chosenOption.text : impact.alternativeOption.text)}</span>
																			</div>
																			{#if impact.chosenOption.letter === 'A'}
																				<span class="badge badge-primary badge-sm px-1.5 py-1 text-[8px] font-bold tracking-wider uppercase shrink-0">Gewählt</span>
																			{/if}
																		</div>
																	</div>
																	
																	<!-- Option B -->
																	<div class="rounded-xl border-2 p-3 {impact.chosenOption.letter === 'B' 
																		? 'border-primary bg-primary/5 text-base-content font-semibold shadow-xs' 
																		: 'border-base-300/20 bg-base-200 text-base-content/50'}">
																		<div class="flex items-start justify-between gap-2">
																			<div>
																				<span class="font-bold {impact.chosenOption.letter === 'B' ? 'text-primary' : 'text-base-content/60'}">B:</span>
																				<span>{question?.optionB?.text || (impact.chosenOption.letter === 'B' ? impact.chosenOption.text : impact.alternativeOption.text)}</span>
																			</div>
																			{#if impact.chosenOption.letter === 'B'}
																				<span class="badge badge-primary badge-sm px-1.5 py-1 text-[8px] font-bold tracking-wider uppercase shrink-0">Gewählt</span>
																			{/if}
																		</div>
																	</div>

																	<!-- Option C -->
																	{#if question?.optionC}
																		<div class="rounded-xl border-2 p-3 {impact.chosenOption.letter === 'C' 
																			? 'border-primary bg-primary/5 text-base-content font-semibold shadow-xs' 
																			: 'border-base-300/20 bg-base-200 text-base-content/50'}">
																			<div class="flex items-start justify-between gap-2">
																				<div>
																					<span class="font-bold {impact.chosenOption.letter === 'C' ? 'text-primary' : 'text-base-content/60'}">C:</span>
																					<span>{question.optionC.text}</span>
																				</div>
																				{#if impact.chosenOption.letter === 'C'}
																					<span class="badge badge-primary badge-sm px-1.5 py-1 text-[8px] font-bold tracking-wider uppercase shrink-0">Gewählt</span>
																				{/if}
																			</div>
																		</div>
																	{/if}
																</div>
															</div>

															<!-- Values effect -->
															<div class="flex flex-col justify-between gap-3">
																<div>
																	<h4 class="mb-2 text-[10px] font-bold uppercase tracking-wider text-base-content/70">Werte-Verschiebung durch Ihre Wahl</h4>
																	{#if impact.axisShifts.length > 0}
																		<div class="flex flex-col gap-1.5">
																			{#each impact.axisShifts as shift}
																				<div class="flex items-center justify-between rounded-lg border border-base-300/40 bg-base-200 p-2 text-[11px] text-base-content">
																					<span class="text-base-content/60">{shift.axisName}:</span>
																					<div class="flex items-center gap-1">
																						<span class="font-bold {shift.delta >= 0 ? 'text-green-700' : 'text-orange-700'} font-mono">
																							{shift.delta >= 0 ? '+' : ''}{shift.delta.toFixed(1)}
																						</span>
																						<span class="text-base-content/80 font-normal">({shift.label})</span>
																					</div>
																				</div>
																			{/each}
																		</div>
																	{:else}
																		<p class="text-[11px] text-base-content/50 italic">Diese Wahl hat keine ideologischen Achsen verschoben.</p>
																	{/if}
																</div>
															</div>

																{#if hasEffect && selectedEffect}
																	<div class="rounded-xl border border-green-200 bg-green-50/50 p-3 text-[11px] leading-relaxed text-green-800">
																		<span class="font-bold text-green-900">Effekt:</span> Durch Ihre Wahl der Option {impact.chosenOption.letter} hat sich die Übereinstimmung mit der 
																		<span class="font-bold text-green-900">{selectedPartyName}</span> im Vergleich zur anderen Option um 
																		<span class="font-bold font-mono">{selectedEffect.deltaPercentage >= 0 ? '+' : ''}{selectedEffect.deltaPercentage.toFixed(1)}%</span> verändert.
																	</div>
																{/if}
															</div>
														</div>
													</div>
												{/each}
										</div>
									</div>
							{/if}
						</div>
					</div>
				{:else}
					<div class="card w-full border border-base-300/40 bg-base-200 p-8 text-center text-base-content/60 shadow-md">
						Wählen Sie eine Partei aus der Liste links aus, um detaillierte Ergebnisse zu sehen.
					</div>
				{/if}
			</div>
		</div>

		<!-- DEBUG MODE SECTION -->
		<div class="mt-8 w-full border-t border-base-300 pt-8">
			<div class="mb-4 flex justify-center">
				<button
					class="btn btn-ghost btn-xs flex items-center gap-1 font-mono text-slate-500 hover:text-slate-700"
					onclick={() => (showDebug = !showDebug)}
				>
					<span>{showDebug ? '⚙️ Debug-Ausgabe ausblenden' : '⚙️ Debug-Ausgabe einblenden'}</span>
				</button>
			</div>

			{#if showDebug}
				<div
					class="animate-fadeIn card w-full overflow-hidden border border-slate-700 bg-slate-900 font-mono text-xs text-slate-100 shadow-xl"
				>
					<div
						class="flex items-center justify-between border-b border-slate-700 bg-slate-800 px-6 py-4"
					>
						<span class="font-bold uppercase tracking-wider text-amber-400"
							>🔧 Entwickler-Debug-Konsole</span
						>
						<span class="badge badge-warning font-semibold">Quiz State Inspector</span>
					</div>

					<div class="space-y-6 p-6">
						<!-- Phase 1: Profiling -->
						<div>
							<h3 class="mb-2 border-b border-slate-700 pb-1 text-sm font-bold text-amber-300">
								1. Profiling-Entscheidungen (Demografie)
							</h3>
							{#if debugProfilingAnswers.length > 0}
								<div class="space-y-2">
									{#each debugProfilingAnswers as prof}
										<div
											class="bg-slate-850 flex flex-col gap-2 rounded border border-slate-800 p-2.5 md:flex-row md:items-center md:justify-between"
										>
											<div>
												<span class="block text-[10px] font-bold uppercase text-slate-400"
													>Frage ID: {prof.id}</span
												>
												<span class="font-semibold text-slate-200">{prof.questionText}</span>
											</div>
											<div
												class="rounded border border-slate-800 bg-slate-900 px-3 py-1.5 text-right md:self-center"
											>
												<span class="block text-[9px] font-bold uppercase text-slate-400"
													>Wert: {prof.val}</span
												>
												<span class="font-bold text-emerald-400">{prof.answerText}</span>
											</div>
										</div>
									{/each}
								</div>
							{:else}
								<p class="italic text-slate-500">Keine Profiling-Daten vorhanden.</p>
							{/if}
						</div>

						<!-- Phase 2: Dilemmas -->
						<div>
							<h3 class="mb-2 border-b border-slate-700 pb-1 text-sm font-bold text-amber-300">
								2. Dilemma-Entscheidungen (Ideologie)
							</h3>
							{#if choiceImpacts.length > 0}
								<div class="space-y-2">
									{#each choiceImpacts as impact}
										<div class="bg-slate-850 rounded border border-slate-800 p-2.5">
											<div class="mb-1 flex items-center justify-between">
												<span class="text-[10px] font-bold uppercase text-slate-400"
													>Dilemma {impact.questionId}</span
												>
												<span
													class="badge badge-sm border-emerald-800 bg-emerald-950 text-emerald-400"
													>Option {impact.chosenOption.letter} gewaehlt</span
												>
											</div>
											<p class="mb-2 font-sans leading-relaxed text-slate-300">
												{impact.storyText}
											</p>

											<div
												class="mt-1 grid grid-cols-1 gap-2 border-t border-slate-800/50 pt-1 text-[10px] md:grid-cols-2"
											>
												<div>
													<span class="block font-bold text-slate-500">GEWÄHLTE OPTION:</span>
													<span class="text-emerald-400">{impact.chosenOption.text}</span>
												</div>
												<div>
													<span class="block font-bold text-slate-500">ALTERNATIVE:</span>
													<span class="text-slate-400">{impact.alternativeOption.text}</span>
												</div>
											</div>

											{#if impact.axisShifts.length > 0}
												<div class="mt-2 flex flex-wrap gap-1">
													{#each impact.axisShifts as shift}
														<span
															class="rounded border border-slate-800 bg-slate-900 px-2 py-0.5 text-[9px]"
														>
															{shift.axisName}:
															<span class={shift.delta >= 0 ? 'text-emerald-400' : 'text-amber-400'}
																>{shift.delta >= 0 ? '+' : ''}{shift.delta.toFixed(1)}</span
															>
															({shift.label})
														</span>
													{/each}
												</div>
											{/if}
										</div>
									{/each}
								</div>
							{:else}
								<p class="italic text-slate-500">Keine Dilemma-Daten vorhanden.</p>
							{/if}
						</div>

						<!-- Phase 3: Härtetest -->
						<div>
							<h3 class="mb-2 border-b border-slate-700 pb-1 text-sm font-bold text-amber-300">
								3. Härtetest-Entscheidungen (Reality Checks)
							</h3>
							{#if debugHaertetestAnswers.length > 0}
								<div class="space-y-2">
									{#each debugHaertetestAnswers as check}
										<div class="bg-slate-850 rounded border border-slate-800 p-2.5">
											<div class="mb-1 flex items-center justify-between">
												<span class="text-[10px] font-bold uppercase text-slate-400"
													>Partei: {check.partyId} (ID: {check.id})</span
												>
												<span
													class="badge badge-sm font-semibold
													{check.val === 'agree' ? 'border-emerald-800 bg-emerald-950 text-emerald-400' : ''}
													{check.val === 'neutral' ? 'border-amber-800 bg-amber-950 text-amber-400' : ''}
													{check.val === 'disagree' ? 'border-rose-800 bg-rose-950 text-rose-400' : ''}"
												>
													{check.val === 'agree' ? 'Zustimmung' : ''}
													{check.val === 'neutral' ? 'Neutral' : ''}
													{check.val === 'disagree' ? 'Ablehnung' : ''}
												</span>
											</div>
											<p class="mb-1.5 font-sans leading-relaxed text-slate-300">
												{check.statementText}
											</p>

											<div class="flex flex-wrap gap-x-4 text-[10px] text-slate-400">
												<span
													>Soll-Haltung Partei: <b class="text-slate-200"
														>{check.partyStance === 'agree' ? 'Zustimmung' : 'Ablehnung'}</b
													></span
												>
												<span
													>Abzug bei Abweichung: <b class="text-rose-400">-{check.penalty}%</b
													></span
												>
												<span
													>Effektiver Abzug:
													{#if check.val === 'disagree' && check.partyStance === 'agree'}
														<b class="text-rose-400">-{check.penalty}%</b>
													{:else if check.val === 'agree' && check.partyStance === 'disagree'}
														<b class="text-rose-400">-{check.penalty}%</b>
													{:else if check.val === 'neutral'}
														<b class="text-amber-400">-{check.penalty / 2}%</b>
													{:else}
														<b class="text-emerald-400">0%</b>
													{/if}
												</span>
											</div>
										</div>
									{/each}
								</div>
							{:else}
								<p class="italic text-slate-500">Keine Härtetest-Daten beantwortet.</p>
							{/if}
						</div>

						<!-- Calculated Ideological Profile -->
						<div>
							<h3 class="mb-2 border-b border-slate-700 pb-1 text-sm font-bold text-amber-300">
								4. Berechnetes Ideologisches Profil
							</h3>
							{#if quizState.ideologicalProfile}
								<div class="grid grid-cols-1 gap-2 md:grid-cols-2">
									{#each Object.entries(quizState.ideologicalProfile.axis_scores) as [axisId, score]}
										{@const axis = ideologicalAxes.find((a) => a.id === axisId)}
										<div
											class="bg-slate-850 flex items-center justify-between rounded border border-slate-800 p-2.5"
										>
											<div>
												<span class="font-bold text-slate-300">{axis?.name || axisId}</span>
												<span class="block text-[9px] uppercase text-slate-500"
													>Achsen-ID: {axisId}</span
												>
											</div>
											<div class="text-right">
												<span class="text-base font-bold text-amber-400">{score.toFixed(2)}</span>
												<span class="block text-[9px] text-slate-500"
													>Skala {axis?.min_value || 1}-{axis?.max_value || 10}</span
												>
											</div>
										</div>
									{/each}
								</div>
							{:else}
								<p class="italic text-slate-500">Keine ideologischen Profildaten berechnet.</p>
							{/if}
						</div>

						<!-- Raw State Inspector JSON -->
						<div>
							<h3 class="mb-2 border-b border-slate-700 pb-1 text-sm font-bold text-amber-300">
								5. Kompletter roher Session-State (JSON)
							</h3>
							<pre
								class="border-slate-850 scrollbar-thin max-h-[300px] overflow-x-auto rounded border bg-slate-950 p-4 text-[10px] text-emerald-400"><code
									>{JSON.stringify(quizState, null, 2)}</code
								></pre>
						</div>
					</div>
				</div>
			{/if}
		</div>

		<!-- RESTART BUTTON -->
		<div class="w-full pb-12 pt-8 text-center">
			<button
				class="btn btn-outline btn-primary"
				onclick={() => {
					resetQuiz();
					goto('/fragen');
				}}
			>
				Quiz neu starten
			</button>
		</div>
	{/if}
</div>
