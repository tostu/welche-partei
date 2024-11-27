<script>
	import { onMount, onDestroy } from 'svelte';
	import { slide } from 'svelte/transition';

	let { textList = [] } = $props();

	let index = $state(0);
	let roller = $state();

	onMount(() => {
		roller = setInterval(() => {
			if (index === textList.length - 1) index = 0;
			else index++;
		}, 2500);
	});

	onDestroy(() => {
		clearInterval(roller);
	});
</script>

{#key index}
	<h2 transition:slide>{textList[index]}</h2>
{/key}