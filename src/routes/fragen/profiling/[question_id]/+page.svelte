<script lang="ts">
	import type { PageProps } from './$types';
	import type { ProfilingAnswer } from '$lib/profiling/types';
	import { quizState } from '$lib/stores/quizState.svelte';
	import { goto } from '$app/navigation';
	import { selectNarrativeQuestions } from '$lib/narrative/selection';

	let { data }: PageProps = $props();

	function saveAnswer(answer: ProfilingAnswer) {
		// Save the answer value to profiling profile
		if (answer.value !== undefined) {
			quizState.profilingProfile[data.question.id] = answer.value;
		}

		// Determine next step
		if (answer.next_question_id) {
			// Navigate to the next profiling question
			quizState.currentProfilingQuestionId = answer.next_question_id;
			goto(`/fragen/profiling/${answer.next_question_id}`);
		} else if (data.question.default_next_question_id) {
			// Use default next question
			quizState.currentProfilingQuestionId = data.question.default_next_question_id;
			goto(`/fragen/profiling/${data.question.default_next_question_id}`);
		} else {
			// Terminal node - profiling complete!
			quizState.profilingComplete = true;

			// Select personalized narrative questions based on profiling
			const selectedQuestions = selectNarrativeQuestions(quizState.profilingProfile, 8);
			quizState.selectedNarrativeQuestions = selectedQuestions;
			quizState.currentNarrativeIndex = 0;

			// Navigate to first narrative question
			goto('/fragen/narrative/0');
		}
	}
</script>

<div class="m-5 flex h-full flex-col items-center justify-center gap-5 md:gap-10">
	<h1 class="text-center text-3xl text-white md:text-5xl">{data.question.text}</h1>
	<div class="flex w-full max-w-[1000px] flex-wrap justify-center gap-10">
		{#each data.question.answers as answer}
			<div
				role="button"
				tabindex="0"
				onclick={() => saveAnswer(answer)}
				onkeydown={(event) =>
					(event.key === 'Enter' || event.key === ' ') && saveAnswer(answer)}
				class="card h-72 w-72 cursor-pointer bg-secondary text-primary-content transition-shadow duration-300 hover:shadow-xl"
			>
				<div class="card-body flex flex-col items-center justify-center text-center text-neutral">
					<h2 class="lilita-one-regular card-title text-3xl">{answer.text}</h2>
				</div>
			</div>
		{/each}
	</div>
</div>
