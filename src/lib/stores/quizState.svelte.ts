import type { UserProfile } from '$lib/profiling/types';
import type { NarrativeQuestion } from '$lib/narrative/types';
import type { UserIdeologicalProfile } from '$lib/ideology/types';
import type { Party } from '$lib/parties';
import { browser } from '$app/environment';

const STORAGE_KEY = 'welche-partei-quiz-state';

/**
 * Quiz State Interface
 */
interface QuizState {
	// ===== PROFILING PHASE =====
	currentProfilingQuestionId: string | null;
	profilingProfile: UserProfile;
	profilingComplete: boolean;

	// ===== NARRATIVE PHASE =====
	selectedNarrativeQuestions: NarrativeQuestion[];
	currentNarrativeIndex: number;
	narrativeAnswers: Record<number, 'A' | 'B' | 'C'>;
	narrativeComplete: boolean;

	// ===== HÄRTETEST PHASE =====
	haertetestPartyIds: Party[];
	haertetestAnswers: Record<string, 'agree' | 'neutral' | 'disagree'>;
	tournamentState: {
		top4: Party[];
		semiFinalWinners: Party[];
		finalWinner: Party | null;
	};
	haertetestComplete: boolean;

	// ===== RESULTS =====
	ideologicalProfile: UserIdeologicalProfile | null;
}

/**
 * Default initial state
 */
const getDefaultState = (): QuizState => ({
	// Initial profiling state
	currentProfilingQuestionId: 'age-group',
	profilingProfile: {},
	profilingComplete: false,

	// Initial narrative state
	selectedNarrativeQuestions: [],
	currentNarrativeIndex: 0,
	narrativeAnswers: {},
	narrativeComplete: false,

	// Initial Härtetest state
	haertetestPartyIds: [],
	haertetestAnswers: {},
	tournamentState: {
		top4: [],
		semiFinalWinners: [],
		finalWinner: null
	},
	haertetestComplete: false,

	// Initial results state
	ideologicalProfile: null
});

/**
 * Load state from sessionStorage
 */
function loadFromSession(): QuizState {
	if (!browser) return getDefaultState();

	try {
		const stored = sessionStorage.getItem(STORAGE_KEY);
		if (!stored) return getDefaultState();

		const parsed = JSON.parse(stored);
		const defaultState = getDefaultState();
		return {
			...defaultState,
			...parsed,
			tournamentState: {
				...defaultState.tournamentState,
				...(parsed.tournamentState || {})
			}
		};
	} catch (error) {
		console.warn('Failed to load quiz state from session:', error);
		return getDefaultState();
	}
}

/**
 * Save state to sessionStorage
 */
function saveToSession(state: QuizState) {
	if (!browser) return;

	try {
		sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	} catch (error) {
		console.warn('Failed to save quiz state to session:', error);
	}
}

/**
 * Clear state from sessionStorage
 */
function clearSession() {
	if (!browser) return;

	try {
		sessionStorage.removeItem(STORAGE_KEY);
	} catch (error) {
		console.warn('Failed to clear quiz state from session:', error);
	}
}

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
 *
 * Persistence:
 * - Automatically saves to sessionStorage on changes
 * - Loads from sessionStorage on initialization
 * - Survives page refreshes and navigation
 */
export const quizState = $state<QuizState>(loadFromSession());

// Note: We'll save to sessionStorage manually when state changes
// instead of using $effect to avoid SSR issues

/**
 * Manually save current quiz state to sessionStorage
 * Call this after updating quiz state
 */
export function saveQuizState() {
	if (!browser) return;

	const currentState: QuizState = {
		currentProfilingQuestionId: quizState.currentProfilingQuestionId,
		profilingProfile: quizState.profilingProfile,
		profilingComplete: quizState.profilingComplete,
		selectedNarrativeQuestions: quizState.selectedNarrativeQuestions,
		currentNarrativeIndex: quizState.currentNarrativeIndex,
		narrativeAnswers: quizState.narrativeAnswers,
		narrativeComplete: quizState.narrativeComplete,
		haertetestPartyIds: quizState.haertetestPartyIds,
		haertetestAnswers: quizState.haertetestAnswers,
		tournamentState: quizState.tournamentState,
		haertetestComplete: quizState.haertetestComplete,
		ideologicalProfile: quizState.ideologicalProfile
	};

	saveToSession(currentState);
}

/**
 * Reset quiz state to initial values and clear sessionStorage
 * Useful for "start over" functionality
 */
export function resetQuiz() {
	// Clear sessionStorage
	clearSession();

	// Reset state to defaults
	const defaultState = getDefaultState();
	quizState.currentProfilingQuestionId = defaultState.currentProfilingQuestionId;
	quizState.profilingProfile = defaultState.profilingProfile;
	quizState.profilingComplete = defaultState.profilingComplete;
	quizState.selectedNarrativeQuestions = defaultState.selectedNarrativeQuestions;
	quizState.currentNarrativeIndex = defaultState.currentNarrativeIndex;
	quizState.narrativeAnswers = defaultState.narrativeAnswers;
	quizState.narrativeComplete = defaultState.narrativeComplete;
	quizState.haertetestPartyIds = defaultState.haertetestPartyIds;
	quizState.haertetestAnswers = defaultState.haertetestAnswers;
	quizState.tournamentState = { ...defaultState.tournamentState };
	quizState.haertetestComplete = defaultState.haertetestComplete;
	quizState.ideologicalProfile = defaultState.ideologicalProfile;
}


/**
 * Check if quiz has any saved state
 */
export function hasExistingQuiz(): boolean {
	if (!browser) return false;
	return sessionStorage.getItem(STORAGE_KEY) !== null;
}

/**
 * Get quiz completion percentage (0-100)
 */
export function getQuizProgress(): number {
	const totalPhases = 3; // Profiling + Narrative + Härtetest
	let completedPhases = 0;

	if (quizState.profilingComplete) completedPhases++;
	if (quizState.narrativeComplete) completedPhases++;
	if (quizState.haertetestComplete) completedPhases++;

	return (completedPhases / totalPhases) * 100;
}
