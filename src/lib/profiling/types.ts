/**
 * Profiling Question Answer Option
 *
 * Represents a single answer choice for a profiling question.
 * Supports conditional branching via the `next_question_id` property.
 */
export interface ProfilingAnswer {
	/** The text displayed for this answer option */
	text: string;

	/**
	 * Optional ID of the next question to display after this answer is selected.
	 * If undefined, the quiz will proceed to the default next question (if configured)
	 * or end the profiling section.
	 */
	next_question_id?: string;

	/** Optional value to store for this answer (for analytics or profiling logic) */
	value?: string | number;
}

/**
 * Profiling Question
 *
 * Represents a single profiling question with dynamic branching logic.
 * Supports a tree/graph-like navigation where the next question depends
 * on the user's selected answer.
 *
 * **Branching Logic:**
 * - Each answer can specify a `next_question_id` to create conditional paths
 * - If no `next_question_id` is specified, the quiz uses the default flow
 * - This enables dynamic, context-aware questioning based on user responses
 *
 * @example
 * ```typescript
 * const question: ProfilingQuestion = {
 *   id: 'age-group',
 *   text: 'Which age group do you belong to?',
 *   answers: [
 *     { text: 'Under 30', next_question_id: 'young-priorities' },
 *     { text: '30-50', next_question_id: 'mid-priorities' },
 *     { text: 'Over 50', next_question_id: 'senior-priorities' }
 *   ]
 * };
 * ```
 */
export interface ProfilingQuestion {
	/** Unique identifier for the question (used for navigation and branching) */
	id: string;

	/** The question text displayed to the user */
	text: string;

	/** Array of answer options for this question */
	answers: ProfilingAnswer[];

	/**
	 * Optional default next question ID if no answer-specific next_question_id is set.
	 * This allows for mixed branching where some answers branch and others follow the default path.
	 */
	default_next_question_id?: string;

	/**
	 * Optional category or tag for the question (for analytics or organization)
	 * Examples: 'demographics', 'priorities', 'lifestyle'
	 */
	category?: string;
}

/**
 * User Profile
 *
 * Stores the user's answers from the profiling quiz.
 * Maps question IDs to the selected answer values.
 *
 * This profile is used for:
 * - Personalizing narrative question selection (demographic matching)
 * - Analytics and user behavior tracking
 * - Potential future features (personalized recommendations, etc.)
 *
 * @example
 * ```typescript
 * const profile: UserProfile = {
 *   'age-group': 'under-30',
 *   'employment-status-young': 'student',
 *   'student-priorities': 'housing-bafög'
 * };
 * ```
 */
export interface UserProfile {
	/** Map of question IDs to selected answer values */
	[questionId: string]: string | number | undefined;
}
