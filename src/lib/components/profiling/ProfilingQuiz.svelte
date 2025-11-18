<script lang="ts">
	import { getStartingQuestion, getQuestionById } from '$lib/profiling/questions';
	import type { ProfilingQuestion } from '$lib/profiling/types';

	// State to hold the current question
	let currentQuestion = $state<ProfilingQuestion>(getStartingQuestion());
	let quizComplete = $state(false);

	/**
	 * Handle answer selection and navigate to the next question
	 * @param nextQuestionId - The ID of the next question to display
	 */
	function handleAnswerClick(nextQuestionId: string | undefined) {
		if (!nextQuestionId) {
			// No next question - quiz is complete
			quizComplete = true;
			return;
		}

		const nextQuestion = getQuestionById(nextQuestionId);
		if (!nextQuestion) {
			console.error(`Question with ID "${nextQuestionId}" not found`);
			quizComplete = true;
			return;
		}

		currentQuestion = nextQuestion;
	}
</script>

<div class="flex min-h-screen w-full flex-col items-center justify-center p-4">
	{#if !quizComplete}
		<!-- Question Card -->
		<div class="card w-full max-w-2xl bg-base-100 shadow-xl">
			<div class="card-body">
				<!-- Question Text -->
				<h2 class="card-title text-2xl md:text-3xl">{currentQuestion.text}</h2>

				<!-- Answer Buttons -->
				<div class="mt-6 flex flex-col gap-3">
					{#each currentQuestion.answers as answer}
						<button
							class="btn btn-primary btn-lg text-left justify-start normal-case h-auto min-h-[4rem] whitespace-normal"
							onclick={() => handleAnswerClick(answer.next_question_id)}
						>
							{answer.text}
						</button>
					{/each}
				</div>
			</div>
		</div>
	{:else}
		<!-- Quiz Complete Message -->
		<div class="card w-full max-w-2xl bg-base-100 shadow-xl">
			<div class="card-body text-center">
				<h2 class="card-title text-2xl md:text-3xl justify-center">Profiling abgeschlossen</h2>
				<p class="text-lg">Vielen Dank! Ihre Angaben wurden gespeichert.</p>
			</div>
		</div>
	{/if}
</div>
