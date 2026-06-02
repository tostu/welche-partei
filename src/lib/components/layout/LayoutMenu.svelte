<script>
	import { House, FlaskConical, RotateCcw } from 'lucide-svelte';
	import { resetQuiz } from '$lib/stores/quizState.svelte';
	import { goto } from '$app/navigation';

	function handleRestart() {
		resetQuiz();
		goto('/fragen');
	}
</script>

<div class="navbar bg-transparent px-4">
	<div class="flex-1">
		<a href="/" class="btn btn-ghost text-xl text-white flex items-center gap-2 hover:bg-black/10">
			<House class="h-5 w-5" />
			<span class="lilita-one-regular text-2xl tracking-wide">Welche Partei?</span>
		</a>
	</div>
	<div class="flex-none flex items-center gap-2">
		<button onclick={handleRestart} class="btn btn-accent btn-sm md:btn-md font-semibold flex items-center gap-2 hover:scale-105 transition-transform duration-200">
			<RotateCcw class="h-4 w-4" />
			<span>Neustart</span>
		</button>

		<a href="/test" class="btn btn-secondary btn-sm md:btn-md font-semibold flex items-center gap-2 hover:scale-105 transition-transform duration-200">
			<FlaskConical class="h-4 w-4" />
			<span>UI Prototypen</span>
		</a>
	</div>
</div>


