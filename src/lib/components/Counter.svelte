<script>
	let amount = $state(0)
</script>

<div class="flex w-full h-full gap-5">
	<button onclick={() => amount--} class="btn btn-block text-5xl flex-1">−</button>
	<span class="text-5xl text-neutral flex-1 text-center">{amount}</span>
	<button onclick={() => amount++} class="btn btn-block text-5xl flex-1">+</button>
</div>
