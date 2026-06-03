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
	import { Sparkles, RotateCcw } from 'lucide-svelte';

	let allMatches = $state<PartyMatch[]>([]);
	let showResults = $state(false);
	let choiceImpacts = $state<ChoiceImpact[]>([]);
	let openQuestions = $state<Record<number, boolean>>({});

	let selectedPartyId = $state<string>('');
	let activeTab = $state<'comparison' | 'haertetest' | 'impact'>('comparison');

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

	let showAllParties = $state(false);
	let displayedMatches = $derived(showAllParties ? adjustedMatches : adjustedMatches.slice(0, 5));


	// Set initial selected party to the best match when available
	$effect(() => {
		if (showResults && !selectedPartyId && adjustedMatches.length > 0) {
			selectedPartyId = adjustedMatches[0].partyId;
		}
	});

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
</script><div class="mx-auto mt-12 flex w-full max-w-7xl flex-col items-center gap-12 px-6 lg:px-12">
	<div class="text-center space-y-4">
		<span class="badge badge-primary font-black uppercase tracking-widest text-xs px-6 py-4 shadow-glow">Auswertung abgeschlossen</span>
		<h1 class="text-5xl md:text-7xl font-black text-primary leading-tight">Ihr Ergebnis</h1>
		<p class="max-w-2xl mx-auto text-lg md:text-xl font-medium text-primary/70 leading-relaxed">
			Basierend auf Ihren Werten und Entscheidungen haben wir die Parteien gefunden, die am besten zu Ihnen passen.
		</p>
	</div>

	{#if showResults && bestMatch}
		<div class="grid w-full grid-cols-1 gap-8 items-stretch">
			<!-- SINGLE RESULT -->
			<div class="glass-card rounded-[2.5rem] p-8 md:p-10 flex flex-col items-center text-center relative overflow-hidden border-accent/20">
				<div class="absolute top-0 right-0 p-6 opacity-10">
					<Sparkles class="h-32 w-32 text-accent animate-pulse-slow" />
				</div>
				<h2 class="text-lg font-black text-primary/70 uppercase tracking-widest mb-6">Beste Übereinstimmung</h2>
				<img
					src={bestMatch.party.logo}
					alt={bestMatch.party.name}
					class="mb-6 h-32 w-32 rounded-full object-contain bg-white p-4 shadow-premium border-4 border-white animate-float"
				/>
				<h3 class="text-4xl md:text-5xl font-black text-primary mb-4">{bestMatch.party.name}</h3>
				<div class="mb-8">
					<div class="flex items-center justify-center gap-3">
						<span class="text-7xl font-black text-primary tracking-tighter">{bestMatch.matchPercentage.toFixed(0)}%</span>
						{#if bestMatch.penalty > 0}
							<span class="badge badge-error font-black text-xs text-white py-3 px-4 rounded-xl shadow-md">-{bestMatch.penalty}%</span>
						{/if}
					</div>
					<div class="text-xs font-black uppercase tracking-widest text-primary/30 mt-2">Gesamt-Übereinstimmung</div>
				</div>
				<button class="btn btn-primary btn-lg h-auto py-4 px-10 rounded-2xl text-lg text-white font-black shadow-premium hover:shadow-glow transition-all">
					Wahlprogramm entdecken
				</button>
			</div>
		</div>

		<!-- INTERACTIVE RESULTS DASHBOARD -->
		<div class="grid w-full grid-cols-1 gap-12 lg:grid-cols-12 pt-12">
			<!-- LEFT PANEL: Alle Parteien im Vergleich -->
			<div class="flex flex-col gap-6 lg:col-span-4">
				<div class="glass-card rounded-[2.5rem] p-8 border-white/30">
					<div class="space-y-2">
						<h2 class="text-2xl font-black text-primary">Ranking</h2>
						<p class="text-xs font-bold text-primary/70 uppercase tracking-widest">Alle 24 Parteien im Vergleich</p>
					</div>
					
					<div class="mt-8 flex flex-col gap-3">
						{#each displayedMatches as match, index}
							{@const isSelected = selectedPartyId === match.partyId}
							<button
								onclick={() => selectedPartyId = match.partyId}
								class="group flex w-full items-center justify-between gap-4 rounded-3xl border-2 p-5 text-left transition-all duration-300 {isSelected 
									? 'border-primary bg-primary text-white shadow-premium scale-[1.05] z-10' 
									: 'border-white/20 bg-white/10 hover:border-white/40 hover:bg-white/20'}"
							>
								<div class="flex items-center gap-4 min-w-0">
									<span class="font-black shrink-0 text-xl opacity-30">
										{(index + 1).toString().padStart(2, '0')}
									</span>
									{#if match.party.logo}
										<div class="h-10 w-10 rounded-full bg-white p-1 shrink-0 shadow-sm border border-white/50">
											<img
												src={match.party.logo}
												alt={match.party.name}
												class="h-full w-full object-contain"
											/>
										</div>
									{/if}
									<div class="min-w-0">
										<div class="font-black text-lg truncate leading-tight">
											{match.party.name}
										</div>
										{#if match.penalty > 0}
											<div class="text-[9px] font-black uppercase tracking-widest opacity-60 mt-1">
												-{match.penalty.toFixed(0)}% Reality Check
											</div>
										{/if}
									</div>
								</div>
								<div class="text-right shrink-0">
									<div class="text-2xl font-black font-mono leading-none">{match.matchPercentage.toFixed(0)}%</div>
								</div>
							</button>
						{/each}
					</div>

					{#if adjustedMatches.length > 5}
						<button
							onclick={() => (showAllParties = !showAllParties)}
							class="btn btn-ghost btn-sm w-full mt-4 text-xs font-black uppercase tracking-wider text-primary/60 hover:text-primary hover:bg-primary/5 rounded-2xl py-3"
						>
							{showAllParties ? 'Weniger anzeigen' : `Alle ${adjustedMatches.length} Parteien anzeigen`}
						</button>
					{/if}
				</div>
			</div>

			<!-- RIGHT PANEL: Party Details -->
			<div class="flex flex-col gap-6 lg:col-span-8">
				{#if selectedMatch}
					<div class="glass-card w-full rounded-[3rem] overflow-hidden border-white/40">
						<!-- Header -->
						<div class="bg-primary p-10 flex flex-col sm:flex-row items-center justify-between gap-10">
							<div class="flex items-center gap-6 text-center sm:text-left flex-col sm:flex-row">
								{#if selectedMatch.party.logo}
									<div class="h-24 w-24 rounded-[2rem] bg-white p-4 shadow-xl border-4 border-white animate-float">
										<img
											src={selectedMatch.party.logo}
											alt={selectedMatch.party.name}
											class="h-full w-full object-contain"
										/>
									</div>
								{/if}
								<div class="space-y-1">
									<h2 class="text-4xl font-black text-white">{selectedMatch.party.name}</h2>
									<div class="badge badge-accent font-black uppercase tracking-widest text-[10px] px-4 py-3">Rang {adjustedMatches.findIndex(m => m.partyId === selectedPartyId) + 1} von {adjustedMatches.length}</div>
								</div>
							</div>
							<div class="text-center sm:text-right shrink-0 bg-white/10 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/10">
								<div class="text-6xl font-black text-white font-mono leading-none tracking-tighter">
									{selectedMatch.matchPercentage.toFixed(0)}%
								</div>
								<div class="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mt-3">Übereinstimmung</div>
							</div>
						</div>

						<!-- Tabbed Navigation -->
						<div class="flex gap-2 p-6 bg-white/5 border-b border-white/10">
							<button 
								class="flex-1 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all {activeTab === 'comparison' ? 'bg-primary text-white shadow-premium' : 'text-primary/40 hover:bg-primary/5 hover:text-primary'}"
								onclick={() => activeTab = 'comparison'}
							>
								Werte-Match
							</button>
							<button 
								class="flex-1 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all {activeTab === 'impact' ? 'bg-primary text-white shadow-premium' : 'text-primary/40 hover:bg-primary/5 hover:text-primary'}"
								onclick={() => activeTab = 'impact'}
							>
								Dilemma-Einfluss
							</button>
						</div>

						<!-- Tab Content -->
						<div class="p-10">
							{#if activeTab === 'comparison'}
								<!-- TAB 1: VALUES COMPARISON -->
								<div class="space-y-10">
									<div class="flex items-start gap-4 p-6 bg-primary/5 rounded-3xl border border-primary/10">
										<Sparkles class="h-6 w-6 text-accent shrink-0 mt-1" />
										<p class="text-sm font-bold text-primary/70 leading-relaxed">
											Hier sehen Sie, wie Ihre Position auf den vier ideologischen Grundachsen im Vergleich zur <span class="text-primary font-black">{selectedMatch.party.name}</span> liegt.
										</p>
									</div>

									<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
										{#each ideologicalAxes as axis}
											{@const userScore = quizState.ideologicalProfile?.axis_scores[axis.id] || 5.5}
											{@const partyScore = selectedPartyIdeology?.axis_scores[axis.id] || 5.5}

											<div class="space-y-6 p-2">
												<div class="space-y-1">
													<h3 class="font-black text-primary text-lg uppercase tracking-tight">{axis.name}</h3>
													<p class="text-[11px] font-bold text-primary/40 uppercase tracking-widest">{axis.description}</p>
												</div>

												<!-- Visual slider -->
												<div class="relative h-12 flex items-center">
													<div class="absolute inset-0 bg-primary/5 rounded-2xl border border-primary/10"></div>
													<div class="absolute left-6 right-6 h-1 bg-primary/10 rounded-full"></div>

													<!-- User position -->
													<div
														class="absolute z-20 h-8 w-8 rounded-full border-4 border-white bg-primary shadow-premium transition-all duration-500 hover:scale-110"
														style="left: {((userScore - axis.min_value) / (axis.max_value - axis.min_value)) * 100}%; transform: translateX(-50%)"
													>
														<div class="absolute -top-10 left-1/2 -translate-x-1/2 bg-primary text-white text-[9px] font-black px-2 py-1 rounded-lg shadow-sm whitespace-nowrap">SIE</div>
													</div>

													<!-- Party position -->
													<div
														class="absolute z-10 h-8 w-8 rounded-full border-4 border-white bg-secondary shadow-premium transition-all duration-500 hover:scale-110"
														style="left: {((partyScore - axis.min_value) / (axis.max_value - axis.min_value)) * 100}%; transform: translateX(-50%)"
													>
														<div class="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-secondary text-white text-[9px] font-black px-2 py-1 rounded-lg shadow-sm whitespace-nowrap">{selectedMatch.party.name}</div>
													</div>
												</div>

												<!-- Labels -->
												<div class="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-primary/30 px-2">
													<span>{axis.min_label}</span>
													<span>{axis.max_label}</span>
												</div>
											</div>
										{/each}
									</div>
								</div>
							{:else if activeTab === 'impact'}
								<!-- TAB 3: CHOICE IMPACT -->
								<div class="space-y-8">
									<div class="flex items-start gap-4 p-6 bg-secondary/5 rounded-3xl border border-secondary/10">
										<RotateCcw class="h-6 w-6 text-secondary shrink-0 mt-1" />
										<p class="text-sm font-bold text-secondary/70 leading-relaxed">
											Welche Entscheidungen haben den Ausschlag gegeben? Sehen Sie hier den Einfluss Ihrer Dilemma-Wahlen auf das Ergebnis.
										</p>
									</div>

									<div class="flex flex-col gap-4">
										{#each choiceImpacts as impact}
											{@const selectedEffect = impact.partyMatchEffects.find((e) => e.partyId === selectedPartyId)}
											{@const isPositive = selectedEffect && selectedEffect.deltaPercentage >= 0}
											
											<div class="glass-card rounded-3xl p-6 hover:bg-white/20 transition-all border-white/20">
												<div class="flex flex-col md:flex-row justify-between gap-6">
													<div class="space-y-3 flex-1">
														<div class="flex items-center gap-3">
															<span class="badge badge-secondary/10 text-secondary font-black text-[9px] uppercase tracking-widest px-3 py-3 border-secondary/20">Dilemma {impact.questionId}</span>
															{#if selectedEffect}
																<span class="font-black font-mono text-sm {isPositive ? 'text-emerald-600' : 'text-rose-600'}">
																	{isPositive ? '+' : ''}{selectedEffect.deltaPercentage.toFixed(1)}%
																</span>
															{/if}
														</div>
														<h4 class="text-lg font-black text-primary leading-tight">{impact.storyText}</h4>
													</div>
													
													<div class="flex flex-col gap-2 shrink-0 md:w-64">
														<div class="text-[9px] font-black uppercase tracking-widest text-primary/30">Ihre Wahl</div>
														<div class="bg-primary/5 rounded-2xl p-4 border border-primary/10">
															<div class="flex items-center gap-3">
																<div class="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white font-black text-sm shrink-0">
																	{impact.chosenOption.letter}
																</div>
																<span class="text-xs font-bold text-primary leading-snug">{impact.chosenOption.text}</span>
															</div>
														</div>
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
					<div class="glass-card w-full rounded-[3rem] p-20 text-center flex flex-col items-center gap-6 border-dashed border-primary/10">
						<div class="h-24 w-24 rounded-full bg-primary/5 flex items-center justify-center animate-pulse">
							<span class="icon-[tabler--list-check] h-12 w-12 text-primary/20"></span>
						</div>
						<p class="text-xl font-black text-primary/30 uppercase tracking-widest">Wählen Sie eine Partei</p>
					</div>
				{/if}
			</div>
		</div>

		<!-- RESTART BUTTON -->
		<div class="w-full pb-24 pt-12 text-center animate-bounce-slow">
			<button
				class="btn btn-ghost btn-xl h-auto py-6 px-12 rounded-3xl text-primary/40 font-black hover:text-primary hover:bg-primary/5 transition-all"
				onclick={() => {
					resetQuiz();
					goto('/fragen');
				}}
			>
				<RotateCcw class="h-6 w-6 mr-3" />
				Quiz neu starten
			</button>
		</div>
	{/if}
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

