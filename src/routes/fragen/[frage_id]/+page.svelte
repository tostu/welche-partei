<script lang="ts">
	import type { PageProps } from './$types';
	import type { Answer, Category, FullCategory } from '$lib/categories';
	import { answerState } from '$lib/state.svelte';
	import { goto } from '$app/navigation';

	import { questions } from '$lib/questions';

	let { data }: PageProps = $props();

	function saveAnswer(category: Category, answer: Answer<Category>, id: number) {
		answerState.answerMap[category] = answer;

		if (questions.length == id) {
			goto('/coming_soon');
		} else {
			goto(id.toString());
		}
	}
</script>

{JSON.stringify(answerState.answerMap)}

<div class="m-5 flex h-full flex-col items-center justify-center gap-5 md:gap-10">
	<h1 class="text-center text-3xl text-white md:text-5xl">{data.question.text}</h1>
	<div class="flex w-full max-w-[1000px] flex-wrap justify-center gap-10">
		{#each data.question.answers as answer}
			<div
				role="button"
				tabindex="0"
				onclick={() => saveAnswer(data.question.category, answer.answer, data.question.id)}
				onkeydown={(event) =>
					(event.key === 'Enter' || event.key === ' ') &&
					saveAnswer(data.question.category, answer.answer, data.question.id)}
				class="card h-72 w-72 cursor-pointer bg-secondary text-primary-content transition-shadow duration-300 hover:shadow-xl"
			>
				<div class="card-body text-center text-neutral">
					<span class="iconify {answer.icon} h-full w-full"></span>
					<h2 class="lilita-one-regular card-title mt-4 justify-center text-3xl">{answer.text}</h2>
				</div>
			</div>
		{/each}
	</div>
</div>
