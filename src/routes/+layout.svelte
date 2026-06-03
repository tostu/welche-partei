<script lang="ts">
	import '../app.css';
	import LayoutMenu from '$lib/components/layout/LayoutMenu.svelte';
	let { children } = $props();
</script>

<div class="flex flex-1 flex-col">
	<!-- Ambient Background Elements -->
	<div class="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
	<div class="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

	<header class="sticky top-0 z-50">
		<LayoutMenu />
	</header>

	<main class="flex flex-1 flex-col relative z-10">
		{@render children()}
	</main>

	<footer class="relative z-10 p-4 text-center text-xs text-primary/40 font-medium shrink-0">
		&copy; {new Date().getFullYear()} Welche Partei? — Wahlhilfe für die nächste Generation
	</footer>
</div>
