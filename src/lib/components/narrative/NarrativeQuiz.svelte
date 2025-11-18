<script lang="ts">
	import { selectNarrativeQuestions } from '$lib/narrative/selection';
	import type { UserProfile } from '$lib/profiling/types';
	import type { NarrativeQuestion, NarrativeAnswerOption } from '$lib/narrative/types';

	interface Props {
		userProfile: UserProfile;
	}

	let { userProfile }: Props = $props();

	// Tournament state
	type Phase = 'questions' | 'round1' | 'round2' | 'final' | 'complete';

	let allQuestions = $state<NarrativeQuestion[]>([]);
	let currentPhase = $state<Phase>('questions');
	let currentIndex = $state<number>(0);

	// Winners from each phase
	let questionWinners = $state<NarrativeAnswerOption[]>([]); // 8 winners from initial questions
	let round1Winners = $state<NarrativeAnswerOption[]>([]); // 4 winners from round 1
	let round2Winners = $state<NarrativeAnswerOption[]>([]); // 2 winners from round 2
	let finalWinner = $state<NarrativeAnswerOption | null>(null);

	// Initialize the tournament with selected questions
	$effect(() => {
		const selectedQuestions = selectNarrativeQuestions(userProfile, 8);
		allQuestions = selectedQuestions;
	});

	// Get the current pair of options to display
	function getCurrentOptions(): { optionA: NarrativeAnswerOption; optionB: NarrativeAnswerOption; context?: string } | null {
		if (currentPhase === 'questions') {
			// Show the current question's two options
			const question = allQuestions[currentIndex];
			if (question) {
				return {
					optionA: question.optionA,
					optionB: question.optionB,
					context: question.story_text
				};
			}
		} else if (currentPhase === 'round1') {
			// Show two winners from the question phase
			const baseIndex = currentIndex * 2;
			if (baseIndex + 1 < questionWinners.length) {
				return {
					optionA: questionWinners[baseIndex],
					optionB: questionWinners[baseIndex + 1]
				};
			}
		} else if (currentPhase === 'round2') {
			// Show two winners from round 1
			const baseIndex = currentIndex * 2;
			if (baseIndex + 1 < round1Winners.length) {
				return {
					optionA: round1Winners[baseIndex],
					optionB: round1Winners[baseIndex + 1]
				};
			}
		} else if (currentPhase === 'final') {
			// Show two winners from round 2
			if (round2Winners.length === 2) {
				return {
					optionA: round2Winners[0],
					optionB: round2Winners[1]
				};
			}
		}
		return null;
	}

	// Handle option selection
	function handleOptionClick(selectedOption: NarrativeAnswerOption) {
		if (currentPhase === 'questions') {
			// Collect winner from this question
			questionWinners.push(selectedOption);
			currentIndex++;

			// Check if all 8 questions are answered
			if (currentIndex >= allQuestions.length) {
				// Move to Round 1 (bracket phase)
				currentPhase = 'round1';
				currentIndex = 0;
			}
		} else if (currentPhase === 'round1') {
			// Collect winner from this matchup
			round1Winners.push(selectedOption);
			currentIndex++;

			// Check if all 4 matchups are complete (8 winners → 4 winners)
			if (currentIndex >= 4) {
				// Move to Round 2
				currentPhase = 'round2';
				currentIndex = 0;
			}
		} else if (currentPhase === 'round2') {
			// Collect winner from this matchup
			round2Winners.push(selectedOption);
			currentIndex++;

			// Check if all 2 matchups are complete (4 winners → 2 winners)
			if (currentIndex >= 2) {
				// Move to Final
				currentPhase = 'final';
				currentIndex = 0;
			}
		} else if (currentPhase === 'final') {
			// Record final winner
			finalWinner = selectedOption;
			currentPhase = 'complete';
		}
	}

	// Get current options for display
	let currentOptions = $derived(getCurrentOptions());

	// Calculate progress
	let totalSteps = $derived(
		currentPhase === 'questions' ? 8 :
		currentPhase === 'round1' ? 4 :
		currentPhase === 'round2' ? 2 : 1
	);
	let completedSteps = $derived(currentIndex);
	let phaseName = $derived(
		currentPhase === 'questions' ? 'Fragen' :
		currentPhase === 'round1' ? 'Runde 1' :
		currentPhase === 'round2' ? 'Runde 2' : 'Finale'
	);
</script>

{#if currentPhase === 'complete'}
	<div class="flex flex-col items-center justify-center min-h-screen p-4">
		<div class="card bg-base-100 shadow-xl max-w-2xl w-full">
			<div class="card-body items-center text-center">
				<h2 class="card-title text-2xl mb-4">Quiz abgeschlossen!</h2>
				<p class="text-lg mb-4">Ihre bevorzugte Position:</p>
				<div class="alert alert-success">
					<span class="text-lg font-semibold">{finalWinner?.text}</span>
				</div>
			</div>
		</div>
	</div>
{:else if currentOptions}
	<div class="flex flex-col min-h-screen p-4 gap-6">
		<!-- Progress indicator -->
		<div class="flex flex-col items-center gap-2">
			<div class="text-sm font-semibold text-base-content/70">
				{phaseName} - Auswahl {completedSteps + 1} von {totalSteps}
			</div>
			<progress
				class="progress progress-primary w-full max-w-md"
				value={completedSteps + 1}
				max={totalSteps}
			></progress>
		</div>

		<!-- Story context (only for initial question phase) -->
		{#if currentPhase === 'questions' && currentOptions.context}
			<div class="card bg-base-200 shadow-md">
				<div class="card-body">
					<p class="text-base text-base-content/90">{currentOptions.context}</p>
				</div>
			</div>
		{/if}

		<!-- Main question heading -->
		<div class="text-center">
			<h2 class="text-xl font-bold text-base-content">
				{currentPhase === 'questions' ? 'Was würden Sie bevorzugen?' : 'Welche Position bevorzugen Sie?'}
			</h2>
		</div>

		<!-- "This or That" cards -->
		<div class="flex flex-col md:flex-row gap-4 flex-1 items-stretch">
			<!-- Option A -->
			<button
				class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all flex-1 cursor-pointer border-2 border-transparent hover:border-primary"
				onclick={() => handleOptionClick(currentOptions.optionA)}
			>
				<div class="card-body items-center text-center justify-center">
					<p class="text-lg">{currentOptions.optionA.text}</p>
				</div>
			</button>

			<!-- VS divider -->
			<div class="flex items-center justify-center">
				<div class="badge badge-lg badge-primary">VS</div>
			</div>

			<!-- Option B -->
			<button
				class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all flex-1 cursor-pointer border-2 border-transparent hover:border-primary"
				onclick={() => handleOptionClick(currentOptions.optionB)}
			>
				<div class="card-body items-center text-center justify-center">
					<p class="text-lg">{currentOptions.optionB.text}</p>
				</div>
			</button>
		</div>
	</div>
{:else}
	<div class="flex items-center justify-center min-h-screen">
		<span class="loading loading-spinner loading-lg"></span>
	</div>
{/if}
