<script>
	let amount = $state(0);
</script>

<div class="flex h-full w-full gap-5">
	<button onclick={() => amount--} class="btn btn-block flex-1 text-5xl">−</button>
	<span class="flex-1 text-center text-5xl text-neutral">{amount}</span>
	<button onclick={() => amount++} class="btn btn-block flex-1 text-5xl">+</button>
</div>
