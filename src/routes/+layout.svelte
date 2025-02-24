<script lang="ts">
	import '../app.css';
	import LayoutMenu from '$lib/components/layout/LayoutMenu.svelte';
	let { children } = $props();
</script>

<div class="flex min-h-svh flex-col">
	<div>
		<LayoutMenu />
	</div>

	<div class="flex flex-1">
		{@render children()}
	</div>
</div>
