/**
 * Ideological Axis Definition
 *
 * Represents a single dimension of political ideology (e.g., Market vs. State, Individual vs. Collective).
 * Each axis has a defined range and labels for both ends of the spectrum.
 */
export interface IdeologicalAxis {
	/** Unique identifier for the axis (kebab-case, e.g., 'market-state') */
	id: string;

	/** Display name for the axis */
	name: string;

	/** Explanation of what this axis represents */
	description: string;

	/** Minimum score value (e.g., 1) */
	min_value: number;

	/** Maximum score value (e.g., 10) */
	max_value: number;

	/** Label for the minimum end of the spectrum (e.g., 'Free Market') */
	min_label: string;

	/** Label for the maximum end of the spectrum (e.g., 'State Control') */
	max_label: string;
}

/**
 * Party Ideological Profile
 *
 * Stores a political party's position across all defined ideological axes.
 * Each party has a score (1-10) for every axis, representing their policy stance.
 */
export interface PartyIdeologicalProfile {
	/** Party identifier (matches Party type from parties.ts) */
	party_id: string;

	/** Map of axis_id to score (e.g., { 'market-state': 8, 'individual-collective': 7 }) */
	axis_scores: Record<string, number>;
}

/**
 * User Ideological Profile
 *
 * Stores a user's calculated ideological position across all defined axes.
 * Calculated from narrative quiz responses by applying answer impacts to neutral starting values.
 */
export interface UserIdeologicalProfile {
	/** Map of axis_id to score (e.g., { 'market-state': 6.5, 'individual-collective': 4.2 }) */
	axis_scores: Record<string, number>;

	/** Optional confidence scores per axis (reserved for future use) */
	confidence?: Record<string, number>;
}

/**
 * Narrative Answer Impact
 *
 * Defines how a specific narrative quiz answer affects an ideological axis score.
 * Used to map user choices to changes in their ideological profile.
 */
export interface NarrativeAnswerImpact {
	/** ID of the axis to modify (e.g., 'market-state') */
	axis_id: string;

	/** Change to apply to the axis score (can be positive or negative) */
	delta: number;
}

/**
 * User Quiz Answers
 *
 * Stores a user's responses to the narrative quiz.
 * Maps question IDs to their selected option ('A' or 'B').
 */
export interface UserQuizAnswers {
	/** Map of question_id to selected option (e.g., { 1: 'A', 2: 'B', 3: 'C' }) */
	narrative_choices: Record<number, 'A' | 'B' | 'C'>;
}
