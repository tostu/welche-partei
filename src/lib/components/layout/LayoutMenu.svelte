<script>
	import { House, FlaskConical, RotateCcw } from 'lucide-svelte';
	import { resetQuiz } from '$lib/stores/quizState.svelte';
	import { goto } from '$app/navigation';

	function handleRestart() {
		resetQuiz();
		goto('/fragen');
	}
</script>

<div class="navbar bg-white/5 backdrop-blur-md border-b border-white/10 px-6 py-4">
	<div class="flex-1">
		<a href="/" class="group flex items-center gap-3 hover:opacity-80 transition-all">
			<div class="bg-primary p-2 rounded-xl shadow-premium group-hover:rotate-12 transition-transform duration-300">
				<House class="h-5 w-5 text-white" />
			</div>
			<span class="lilita-one-regular text-2xl tracking-tight text-primary">Welche Partei?</span>
		</a>
	</div>
	<div class="flex-none flex items-center gap-4">
		<button onclick={handleRestart} class="btn btn-ghost text-primary hover:bg-primary/5 font-black text-xs uppercase tracking-widest flex items-center gap-2 px-4">
			<RotateCcw class="h-4 w-4" />
			<span class="hidden md:block">Neustart</span>
		</button>

		<a href="/test" class="btn btn-primary btn-sm md:btn-md h-auto py-2.5 px-6 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-premium hover:shadow-glow transition-all">
			<FlaskConical class="h-4 w-4" />
			<span class="hidden md:block">Prototypen</span>
		</a>
	</div>
</div>


