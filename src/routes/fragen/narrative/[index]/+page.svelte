<script lang="ts">
	import type { PageProps } from './$types';
	import { quizState } from '$lib/stores/quizState.svelte';
	import { goto } from '$app/navigation';
	import { calculateUserIdeology } from '$lib/ideology/calculateUserIdeology';

	let { data }: PageProps = $props();

	function saveAnswer(option: 'A' | 'B') {
		// Save the answer
		quizState.narrativeAnswers[data.question.id] = option;

		// Check if this was the last question
		if (data.index + 1 >= data.totalQuestions) {
			// Narrative phase complete!
			quizState.narrativeComplete = true;

			// Calculate user's ideological profile
			const userQuizAnswers = {
				narrative_choices: quizState.narrativeAnswers
			};

			quizState.ideologicalProfile = calculateUserIdeology(
				userQuizAnswers,
				quizState.selectedNarrativeQuestions
			);

			// Navigate to results
			goto('/ergebnis');
		} else {
			// Navigate to next narrative question
			const nextIndex = data.index + 1;
			quizState.currentNarrativeIndex = nextIndex;
			goto(`/fragen/narrative/${nextIndex}`);
		}
	}
</script>

<div class="m-5 flex h-full flex-col items-center justify-center gap-5 md:gap-10">
	<!-- Progress indicator -->
	<div class="text-center text-sm text-white opacity-70">
		Frage {data.index + 1} von {data.totalQuestions}
	</div>

	<!-- Story text -->
	<h1 class="text-center text-2xl text-white md:text-4xl max-w-[900px]">
		{data.question.story_text}
	</h1>

	<!-- Answer options -->
	<div class="flex w-full max-w-[1000px] flex-wrap justify-center gap-10">
		<!-- Option A -->
		<div
			role="button"
			tabindex="0"
			onclick={() => saveAnswer('A')}
			onkeydown={(event) => (event.key === 'Enter' || event.key === ' ') && saveAnswer('A')}
			class="card h-72 w-72 cursor-pointer bg-secondary text-primary-content transition-shadow duration-300 hover:shadow-xl"
		>
			<div class="card-body flex flex-col items-center justify-center text-center text-neutral">
				<div class="mb-4 text-5xl font-bold opacity-30">A</div>
				<h2 class="lilita-one-regular text-2xl leading-tight">
					{data.question.optionA.text}
				</h2>
			</div>
		</div>

		<!-- Option B -->
		<div
			role="button"
			tabindex="0"
			onclick={() => saveAnswer('B')}
			onkeydown={(event) => (event.key === 'Enter' || event.key === ' ') && saveAnswer('B')}
			class="card h-72 w-72 cursor-pointer bg-secondary text-primary-content transition-shadow duration-300 hover:shadow-xl"
		>
			<div class="card-body flex flex-col items-center justify-center text-center text-neutral">
				<div class="mb-4 text-5xl font-bold opacity-30">B</div>
				<h2 class="lilita-one-regular text-2xl leading-tight">
					{data.question.optionB.text}
				</h2>
			</div>
		</div>
	</div>
</div>
