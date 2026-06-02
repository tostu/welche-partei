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

<div class="m-5 flex h-full flex-col items-center justify-center gap-5 md:gap-10">
	<!-- Question Text -->
	<h1 class="max-w-[900px] text-center text-3xl font-black text-white md:text-5xl" in:fade={{ duration: 250 }}>
		{data.question.text}
	</h1>

	<!-- MULTIPLE CHOICE TYPE -->
	{#if !data.question.type || data.question.type === 'multiple_choice'}
		<div class="flex w-full max-w-[1000px] flex-wrap justify-center gap-6" in:fade={{ duration: 200 }}>
			{#each data.question.answers || [] as answer}
				<button
					onclick={() => saveAnswer(answer)}
					class="card w-full sm:w-[320px] h-48 cursor-pointer bg-secondary text-secondary-content border border-white/10 hover:border-white/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl active:translate-y-0 text-center flex flex-col items-center justify-center p-6 backdrop-blur-sm"
				>
					<h2 class="lilita-one-regular text-2xl font-medium tracking-wide text-secondary-content">
						{answer.text}
					</h2>
				</button>
			{/each}
		</div>

	<!-- BUDGET ALLOCATION TYPE -->
	{:else if data.question.type === 'budget_allocation'}
		<div class="w-full max-w-[700px] flex flex-col gap-6" in:fade={{ duration: 200 }}>
			<!-- Budget Counter Header -->
			<div class="flex items-center justify-between p-4 bg-base-200 border border-base-300/40 rounded-2xl backdrop-blur-md">
				<div class="flex flex-col">
					<span class="text-xs text-base-content/60 uppercase tracking-wider font-bold">Verfügbares Budget</span>
					<span class="text-base-content text-sm font-semibold">Punkte übrig</span>
				</div>
				<div class="flex items-center gap-3">
					<div class="flex gap-1.5">
						{#each Array(maxPoints) as _, i}
							<div 
								class="h-3 w-3 rounded-full border transition-all duration-300 {i < remainingPoints 
									? 'bg-accent border-accent scale-110 animate-pulse' 
									: 'bg-base-300/40 border-base-300'}"
							></div>
						{/each}
					</div>
					<span class="badge badge-lg bg-accent text-accent-content border-none font-extrabold text-sm px-3.5 py-3">
						{remainingPoints} übrig
					</span>
				</div>
			</div>

			<!-- Options list -->
			<div class="flex flex-col gap-4">
				{#each data.question.options || [] as option}
					<div class="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-secondary border border-white/10 rounded-2xl gap-4 backdrop-blur-sm hover:border-white/30 transition-all duration-300">
						<div class="flex-1 space-y-1">
							<p class="text-secondary-content font-bold text-lg">{option.text}</p>
						</div>
						
						<div class="flex items-center justify-between sm:justify-end gap-4">
							<!-- Points Dots allocated to this option -->
							<div class="flex gap-1 w-20 justify-center">
								{#each Array(allocatedPointsMap[option.id] || 0) as _}
									<div class="h-2 w-2 rounded bg-white"></div>
								{/each}
								{#each Array(maxPoints - (allocatedPointsMap[option.id] || 0)) as _}
									<div class="h-2 w-2 rounded bg-white/20"></div>
								{/each}
							</div>

							<!-- Plus/Minus controls -->
							<div class="join bg-white/10 border border-white/20">
								<button 
									class="btn btn-ghost btn-sm join-item px-2.5 hover:bg-white/10 disabled:opacity-20 text-secondary-content" 
									onclick={() => removePoint(option.id)}
									disabled={(allocatedPointsMap[option.id] || 0) === 0}
								>
									<Minus class="h-3.5 w-3.5" />
								</button>
								<span class="join-item bg-transparent text-secondary-content font-mono font-bold text-sm w-8 flex items-center justify-center select-none">
									{allocatedPointsMap[option.id] || 0}
								</span>
								<button 
									class="btn btn-ghost btn-sm join-item px-2.5 hover:bg-white/10 disabled:opacity-20 text-secondary-content" 
									onclick={() => addPoint(option.id)}
									disabled={remainingPoints === 0}
								>
									<Plus class="h-3.5 w-3.5" />
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
				class="btn btn-primary w-full py-4 text-primary-content font-extrabold text-lg tracking-wide rounded-2xl transition-all duration-300 hover:shadow-lg disabled:opacity-30 flex items-center justify-center gap-2"
			>
				Weiter <ArrowRight class="h-5 w-5" />
			</button>
		</div>

	<!-- SLIDER TYPE -->
	{:else if data.question.type === 'slider'}
		<div class="w-full max-w-[800px] flex flex-col gap-8 bg-base-200 border border-base-300/40 rounded-2xl p-6 md:p-8 backdrop-blur-md" in:fade={{ duration: 200 }}>
			
			<div class="py-6 px-4 bg-base-300/20 rounded-2xl flex flex-col gap-6 relative overflow-hidden">
				<!-- Label extremes -->
				<div class="flex justify-between items-stretch gap-4 text-xs font-bold uppercase text-base-content/85 px-2 select-none">
					<div class="flex flex-col items-start gap-1 w-1/2">
						<span class="text-primary text-left text-sm font-semibold">
							{data.question.min_label}
						</span>
					</div>
					<div class="flex flex-col items-end gap-1 w-1/2 text-right">
						<span class="text-secondary text-right text-sm font-semibold">
							{data.question.max_label}
						</span>
					</div>
				</div>

				<!-- Visual connection line -->
				<div class="flex items-center px-4 my-2">
					<div class="flex-1 h-2 bg-base-300/50 rounded-full relative overflow-hidden">
						<div 
							class="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-primary via-accent to-secondary transition-all duration-150"
							style="width: {sliderVal}%"
						></div>
					</div>
				</div>

				<!-- Range Input -->
				<div class="px-2">
					<input 
						type="range" 
						min="0" 
						max="100" 
						bind:value={sliderVal} 
						class="range range-primary range-sm border-0 bg-transparent" 
					/>
					<div class="flex justify-between text-[10px] text-base-content/50 font-mono mt-2">
						<span>Mitte</span>
					</div>
				</div>
			</div>

			<!-- Dynamic indicator depending on where the slider is -->
			<div class="p-4 bg-base-200 border border-base-300/40 rounded-2xl flex flex-col gap-1 text-center">
				<div class="text-base-content text-base font-bold flex items-center justify-center gap-2">
					<Sparkles class="h-4 w-4 text-accent animate-pulse" />
					Gewichtung: 
					<span class="badge bg-base-300/50 text-base-content border-0 font-mono text-sm">{sliderVal}%</span>
				</div>
			</div>

			<!-- Action button -->
			<button 
				onclick={submitSlider}
				class="btn btn-primary w-full py-4 text-primary-content font-extrabold text-lg tracking-wide rounded-2xl transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2"
			>
				Weiter <ArrowRight class="h-5 w-5" />
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
