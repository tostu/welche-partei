<script lang="ts">
	import '../app.css';
	let { children } = $props();
	import LayoutMenu from '$lib/components/layout/LayoutMenu.svelte';
</script>

<div class="min-h-svh flex flex-col">
	<div>
		<LayoutMenu />
	</div>

	<div class="flex flex-1">
		{@render children()}
	</div>

</div>

