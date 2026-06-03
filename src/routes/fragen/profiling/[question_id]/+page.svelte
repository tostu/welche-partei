<script lang="ts">
	import type { PageProps } from './$types';
	import type { ProfilingAnswer } from '$lib/profiling/types';
	import { quizState, saveQuizState } from '$lib/stores/quizState.svelte';
	import { goto } from '$app/navigation';
	import { selectNarrativeQuestions } from '$lib/narrative/selection';
	import { Plus, Minus, ArrowRight, Sparkles, HelpCircle, Coins } from 'lucide-svelte';
	import { fade, slide } from 'svelte/transition';

	let { data }: PageProps = $props();

	// Local state for Budget Allocation
	let allocatedPointsMap = $state<Record<string, number>>({});
	let maxPoints = $derived(data.question.max_points || 5);
	let totalAllocated = $derived(
		Object.values(allocatedPointsMap).reduce((sum, val) => sum + val, 0)
	);
	let remainingPoints = $derived(maxPoints - totalAllocated);

	// Local state for Dilemma Slider
	let sliderVal = $state(50);

	// Reset local state when question changes
	$effect(() => {
		if (data.question.id) {
			sliderVal = 50;
			if (data.question.options) {
				const initialMap: Record<string, number> = {};
				data.question.options.forEach((opt) => {
					initialMap[opt.id] = 0;
				});
				allocatedPointsMap = initialMap;
			}
		}
	});

	function addPoint(key: string) {
		if (remainingPoints > 0) {
			allocatedPointsMap[key] = (allocatedPointsMap[key] || 0) + 1;
		}
	}

	function removePoint(key: string) {
		if ((allocatedPointsMap[key] || 0) > 0) {
			allocatedPointsMap[key]--;
		}
	}

	function finishProfiling() {
		quizState.profilingComplete = true;

		// Select personalized narrative questions based on profiling
		const selectedQuestions = selectNarrativeQuestions(quizState.profilingProfile, 8);
		quizState.selectedNarrativeQuestions = selectedQuestions;
		quizState.currentNarrativeIndex = 0;

		saveQuizState();
		// Navigate to first narrative question
		goto('/fragen/narrative/0');
	}

	function saveAnswer(answer: ProfilingAnswer) {
		// Save the answer value to profiling profile
		if (answer.value !== undefined) {
			quizState.profilingProfile[data.question.id] = answer.value;
		}

		// Determine next step
		if (answer.next_question_id) {
			// Navigate to the next profiling question
			quizState.currentProfilingQuestionId = answer.next_question_id;
			saveQuizState();
			goto(`/fragen/profiling/${answer.next_question_id}`);
		} else if (data.question.default_next_question_id) {
			// Use default next question
			quizState.currentProfilingQuestionId = data.question.default_next_question_id;
			saveQuizState();
			goto(`/fragen/profiling/${data.question.default_next_question_id}`);
		} else {
			finishProfiling();
		}
	}

	function submitBudgetAllocation() {
		if (remainingPoints === 0) {
			quizState.profilingProfile[data.question.id] = { ...allocatedPointsMap };
			if (data.question.default_next_question_id) {
				quizState.currentProfilingQuestionId = data.question.default_next_question_id;
				saveQuizState();
				goto(`/fragen/profiling/${data.question.default_next_question_id}`);
			} else {
				finishProfiling();
			}
		}
	}

	function submitSlider() {
		quizState.profilingProfile[data.question.id] = sliderVal;
		if (data.question.default_next_question_id) {
			quizState.currentProfilingQuestionId = data.question.default_next_question_id;
			saveQuizState();
			goto(`/fragen/profiling/${data.question.default_next_question_id}`);
		} else {
			finishProfiling();
		}
	}
</script>

<div class="m-5 flex h-full flex-col items-center justify-center gap-8 md:gap-12">
	<!-- Progress Bar (Subtle) -->
	<div class="w-full max-w-[600px] h-1.5 bg-primary/10 rounded-full overflow-hidden">
		<div class="h-full bg-primary transition-all duration-500" style="width: 25%"></div>
	</div>

	<!-- Question Text -->
	<div class="space-y-4 text-center">
		<span class="badge badge-primary font-bold uppercase tracking-widest text-[10px] px-4 py-3">Profiling Phase</span>
		<h1 class="max-w-[900px] text-3xl font-black text-primary md:text-5xl leading-tight">
			{data.question.text}
		</h1>
	</div>

	<!-- MULTIPLE CHOICE TYPE -->
	{#if !data.question.type || data.question.type === 'multiple_choice'}
		<div class="flex w-full max-w-[1000px] flex-wrap justify-center gap-6">
			{#each data.question.answers || [] as answer}
				<button
					onclick={() => saveAnswer(answer)}
					class="glass-card group w-full sm:w-[320px] h-48 cursor-pointer hover:bg-white/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-glow active:translate-y-0 text-center flex flex-col items-center justify-center p-8 rounded-3xl"
				>
					<h2 class="lilita-one-regular text-3xl tracking-wide text-primary group-hover:scale-105 transition-transform">
						{answer.text}
					</h2>
					<div class="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
						<span class="icon-[tabler--chevron-right] h-6 w-6 text-primary"></span>
					</div>
				</button>
			{/each}
		</div>

	<!-- BUDGET ALLOCATION TYPE -->
	{:else if data.question.type === 'budget_allocation'}
		<div class="w-full max-w-[700px] flex flex-col gap-8">
			<!-- Budget Counter Header -->
			<div class="flex items-center justify-between p-6 glass-card rounded-3xl">
				<div class="flex flex-col">
					<span class="text-xs text-primary/60 uppercase tracking-widest font-bold">Verfügbares Budget</span>
					<span class="text-primary text-xl font-black">Punkte verteilen</span>
				</div>
				<div class="flex items-center gap-4">
					<div class="flex gap-2">
						{#each Array(maxPoints) as _, i}
							<div 
								class="h-4 w-4 rounded-full border-2 transition-all duration-300 {i < remainingPoints 
									? 'bg-accent border-accent scale-110 shadow-glow' 
									: 'bg-primary/5 border-primary/20'}"
							></div>
						{/each}
					</div>
					<span class="badge badge-lg bg-primary text-white border-none font-black text-sm px-4 py-4 rounded-xl">
						{remainingPoints}
					</span>
				</div>
			</div>

			<!-- Options list -->
			<div class="flex flex-col gap-4">
				{#each data.question.options || [] as option}
					<div class="flex flex-col sm:flex-row sm:items-center justify-between p-5 glass-card rounded-3xl gap-4 hover:bg-white/15 transition-all">
						<div class="flex-1">
							<p class="text-primary font-bold text-xl">{option.text}</p>
						</div>
						
						<div class="flex items-center justify-between sm:justify-end gap-6">
							<!-- Points Indicator -->
							<div class="flex gap-1.5 w-24 justify-center">
								{#each Array(maxPoints) as _, i}
									<div class="h-2.5 w-2.5 rounded-full transition-all {i < (allocatedPointsMap[option.id] || 0) ? 'bg-primary' : 'bg-primary/10'}"></div>
								{/each}
							</div>

							<!-- Plus/Minus controls -->
							<div class="flex items-center gap-1 bg-primary/5 p-1 rounded-2xl border border-primary/10">
								<button 
									class="btn btn-circle btn-ghost btn-sm text-primary hover:bg-primary/10 disabled:opacity-20" 
									onclick={() => removePoint(option.id)}
									disabled={(allocatedPointsMap[option.id] || 0) === 0}
								>
									<Minus class="h-4 w-4" />
								</button>
								<span class="text-primary font-black text-lg w-8 text-center select-none">
									{allocatedPointsMap[option.id] || 0}
								</span>
								<button 
									class="btn btn-circle btn-ghost btn-sm text-primary hover:bg-primary/10 disabled:opacity-20" 
									onclick={() => addPoint(option.id)}
									disabled={remainingPoints === 0}
								>
									<Plus class="h-4 w-4" />
								</button>
							</div>
						</div>
					</div>
				{/each}
			</div>

			<!-- Action button -->
			<button 
				onclick={submitBudgetAllocation}
				disabled={remainingPoints > 0}
				class="btn btn-primary w-full py-5 h-auto text-white font-black text-xl tracking-wide rounded-3xl transition-all duration-300 shadow-premium hover:shadow-glow disabled:opacity-30 group"
			>
				<span>Weiter</span>
				<ArrowRight class="h-6 w-6 group-hover:translate-x-1 transition-transform" />
			</button>
		</div>

	<!-- SLIDER TYPE -->
	{:else if data.question.type === 'slider'}
		<div class="w-full max-w-[800px] flex flex-col gap-10 glass-card rounded-[2.5rem] p-8 md:p-12">
			
			<div class="space-y-12">
				<!-- Label extremes -->
				<div class="flex justify-between items-start gap-8">
					<div class="flex-1 p-6 rounded-3xl bg-primary/5 border border-primary/10 text-center">
						<span class="text-primary font-black text-lg leading-tight block">
							{data.question.min_label}
						</span>
					</div>
					<div class="flex-1 p-6 rounded-3xl bg-secondary/10 border border-secondary/20 text-center">
						<span class="text-secondary font-black text-lg leading-tight block">
							{data.question.max_label}
						</span>
					</div>
				</div>

				<!-- Stepper Slider Control -->
				<div class="w-full max-w-xl mx-auto">
					<input 
						type="range" 
						min="0" 
						max="100" 
						bind:value={sliderVal} 
						class="range range-primary" 
						step="25"
					/>
					<div class="flex justify-between px-2.5 mt-2 text-xs text-primary font-bold">
						<span>|</span>
						<span>|</span>
						<span>|</span>
						<span>|</span>
						<span>|</span>
					</div>
					<div class="flex justify-between px-2 text-sm text-primary font-black mt-1">
						<span>1</span>
						<span>2</span>
						<span>3</span>
						<span>4</span>
						<span>5</span>
					</div>
				</div>
			</div>

			<!-- Dynamic indicator -->
			<div class="p-6 bg-primary/5 border border-primary/10 rounded-3xl flex items-center justify-center gap-4">
				<Sparkles class="h-6 w-6 text-accent" />
				<span class="text-primary text-lg font-bold">Gewichtung:</span>
				<span class="text-3xl font-black text-primary font-mono">{Math.round(sliderVal / 25) + 1}</span>
			</div>

			<!-- Action button -->
			<button 
				onclick={submitSlider}
				class="btn btn-primary w-full py-5 h-auto text-white font-black text-xl tracking-wide rounded-3xl transition-all duration-300 shadow-premium hover:shadow-glow group"
			>
				<span>Weiter</span>
				<ArrowRight class="h-6 w-6 group-hover:translate-x-1 transition-transform" />
			</button>
		</div>
	{/if}
</div>

<style>
	/* Custom slider thumb styles for a premium look */
	.range::-webkit-slider-thumb {
		background-color: oklch(var(--n));
		border: 3px solid oklch(var(--a));
		cursor: pointer;
		width: 1.6rem;
		height: 1.6rem;
		border-radius: 9999px;
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.3);
		transition: transform 0.15s ease;
	}
	.range::-webkit-slider-thumb:hover {
		transform: scale(1.15);
	}
</style>
