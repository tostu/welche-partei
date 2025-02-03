<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	// Funktion zur Bestimmung der Spaltenanzahl, falls notwendig
	function getGridColumns(count: number): string {
		if (count <= 5) return `grid-cols-${count}`;
		return "grid-cols-3"
	}
</script>


 
<div class="flex flex-col h-full items-center justify-center gap-5 m-5 md:gap-10">
	<h1 class="text-white text-3xl md:text-5xl text-center">{data.question.text}</h1>
	<div class="flex flex-wrap justify-center gap-10 w-full max-w-[1000px]">
	{#each data.question.answers as answer}
		<div class="card bg-secondary text-primary-content w-72 h-72 hover:shadow-xl transition-shadow duration-300 cursor-pointer">
			<div class="card-body text-center text-neutral">
				<span class="iconify {answer.icon} h-full w-full"></span>
				<h2 class="card-title justify-center text-3xl mt-4 lilita-one-regular">{answer.text}</h2>
			</div>
		</div>
	{/each}
</div>

</d@Ral
