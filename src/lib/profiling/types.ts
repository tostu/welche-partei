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
 */
export interface ProfilingQuestion {
	/** Unique identifier for the question (used for navigation and branching) */
	id: string;

	/** The question text displayed to the user */
	text: string;

	/** Optional category or tag for the question (for analytics or organization) */
	category?: string;

	/** The question format paradigm */
	type?: 'multiple_choice' | 'budget_allocation' | 'slider';

	/** Array of answer options for this question (for multiple_choice) */
	answers?: ProfilingAnswer[];

	/** Max points allowed for allocation (for budget_allocation) */
	max_points?: number;

	/** Options to allocate budget points to (for budget_allocation) */
	options?: { id: string; text: string }[];

	/** Minimum extreme label (for slider) */
	min_label?: string;

	/** Maximum extreme label (for slider) */
	max_label?: string;

	/**
	 * Optional default next question ID if no answer-specific next_question_id is set.
	 */
	default_next_question_id?: string;
}

/**
 * User Profile
 *
 * Stores the user's answers from the profiling quiz.
 * Maps question IDs to the selected answer values.
 */
export interface UserProfile {
	/** Map of question IDs to selected answer values */
	[questionId: string]: string | number | Record<string, number> | undefined;
}
