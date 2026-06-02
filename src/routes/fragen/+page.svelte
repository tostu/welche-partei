<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { quizState } from '$lib/stores/quizState.svelte';

	import { getHaertetestStatements } from '$lib/ideology/realityChecks';

	onMount(() => {
		// Smart redirect based on quiz state

		// If narrative phase is in progress, resume there
		if (
			quizState.profilingComplete &&
			quizState.selectedNarrativeQuestions.length > 0 &&
			!quizState.narrativeComplete
		) {
			const resumeIndex = quizState.currentNarrativeIndex;
			goto(`/fragen/narrative/${resumeIndex}`);
			return;
		}

		// If narrative is complete, go to results
		if (quizState.narrativeComplete) {
			goto('/ergebnis');
			return;
		}

		// If profiling is in progress, resume at current question
		if (quizState.currentProfilingQuestionId && !quizState.profilingComplete) {
			goto(`/fragen/profiling/${quizState.currentProfilingQuestionId}`);
			return;
		}

		// Default: Start new quiz
		goto('/fragen/profiling/age-group');
	});
</script>

<!-- Loading state while redirect happens -->
<div class="flex h-full items-center justify-center">
	<div class="text-center">
		<div class="loading loading-spinner loading-lg text-primary"></div>
		<p class="mt-4 text-white">Lade...</p>
	</div>
</div>
