import type { UserProfile } from '$lib/profiling/types';
import type { NarrativeQuestion } from '$lib/narrative/types';
import type { UserIdeologicalProfile } from '$lib/ideology/types';

/**
 * Unified Quiz State
 *
 * Manages the complete state for the two-phase quiz flow:
 * 1. Profiling Phase: Dynamic demographic profiling (3-4 questions)
 * 2. Narrative Phase: Ideological dilemmas (7-8 personalized questions)
 *
 * State progression:
 * - Start with profiling at 'age-group'
 * - Build profiling profile as user answers
 * - After profiling completes, select personalized narrative questions
 * - Track narrative answers and calculate ideological profile
 * - Navigate to results page with complete data
 */
export const quizState = $state<{
	// ===== PROFILING PHASE =====
	/** Current profiling question ID (starts with 'age-group') */
	currentProfilingQuestionId: string | null;

	/**
	 * User's profiling answers
	 * Maps question_id -> answer value
	 * Example: { 'age-group': 'under-30', 'employment-status-young': 'student' }
	 */
	profilingProfile: UserProfile;

	/** Whether profiling phase is complete */
	profilingComplete: boolean;

	// ===== NARRATIVE PHASE =====
	/**
	 * Personalized narrative questions selected based on profiling profile
	 * Selected via selectNarrativeQuestions() after profiling completes
	 */
	selectedNarrativeQuestions: NarrativeQuestion[];

	/** Current narrative question index (0-based) */
	currentNarrativeIndex: number;

	/**
	 * User's narrative answers
	 * Maps question_id -> selected option ('A' or 'B')
	 * Example: { 1: 'A', 3: 'B', 7: 'A' }
	 */
	narrativeAnswers: Record<number, 'A' | 'B'>;

	/** Whether narrative phase is complete */
	narrativeComplete: boolean;

	// ===== RESULTS =====
	/**
	 * User's calculated ideological profile
	 * Computed from narrative answers using calculateUserIdeology()
	 */
	ideologicalProfile: UserIdeologicalProfile | null;
}>({
	// Initial profiling state
	currentProfilingQuestionId: 'age-group',
	profilingProfile: {},
	profilingComplete: false,

	// Initial narrative state
	selectedNarrativeQuestions: [],
	currentNarrativeIndex: 0,
	narrativeAnswers: {},
	narrativeComplete: false,

	// Initial results state
	ideologicalProfile: null
});

/**
 * Reset quiz state to initial values
 * Useful for "start over" functionality
 */
export function resetQuiz() {
	quizState.currentProfilingQuestionId = 'age-group';
	quizState.profilingProfile = {};
	quizState.profilingComplete = false;
	quizState.selectedNarrativeQuestions = [];
	quizState.currentNarrativeIndex = 0;
	quizState.narrativeAnswers = {};
	quizState.narrativeComplete = false;
	quizState.ideologicalProfile = null;
}
