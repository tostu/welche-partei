<script lang="ts">
	import type { PageProps } from './$types';

	import { answerState } from '$lib/state.svelte';

	let { data }: PageProps = $props();

	// Funktion zur Bestimmung der Spaltenanzahl, falls notwendig
	function getGridColumns(count: number): string {
		if (count <= 5) return `grid-cols-${count}`;
		return 'grid-cols-3';
	}
</script>

<div class="m-5 flex h-full flex-col items-center justify-center gap-5 md:gap-10">
	<h1 class="text-center text-3xl text-white md:text-5xl">{data.question.text}</h1>
	<div class="flex w-full max-w-[1000px] flex-wrap justify-center gap-10">
		{#each data.question.answers as answer}
			<div
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
