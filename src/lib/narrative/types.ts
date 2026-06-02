import type { NarrativeAnswerImpact } from '$lib/ideology/types';

/**
 * Narrative Answer Option
 *
 * Represents one of two answer choices for a narrative question.
 * Each option includes the answer text and its impact on ideological axes.
 *
 * @example
 * ```typescript
 * const option: NarrativeAnswerOption = {
 *   text: 'Der Staat sollte eingreifen und die Preise regulieren',
 *   impacts: [
 *     { axis_id: 'market-state', delta: +1.5 },
 *     { axis_id: 'individual-collective', delta: +0.8 }
 *   ]
 * };
 * ```
 */
export interface NarrativeAnswerOption {
	/** The text displayed for this answer option */
	text: string;

	/**
	 * Array of ideological axis impacts resulting from selecting this answer.
	 */
	impacts: NarrativeAnswerImpact[];
}

/**
 * Narrative Question
 *
 * Represents a narrative dilemma question in the ideology quiz.
 */
export interface NarrativeQuestion {
	/** Unique numeric identifier for the question */
	id: number;

	/** The question format paradigm */
	type: 'multiple_choice' | 'budget_allocation' | 'slider';

	/** The story text presenting the dilemma scenario. */
	story_text: string;

	/** Optional fallback option A */
	optionA?: NarrativeAnswerOption;

	/** Optional fallback option B */
	optionB?: NarrativeAnswerOption;

	/** Optional fallback option C */
	optionC?: NarrativeAnswerOption;

	/** Multiple choice answers (each has text and impacts) */
	answers?: {
		text: string;
		impacts: NarrativeAnswerImpact[];
	}[];

	/** Options to allocate budget points to (for budget_allocation) */
	options?: {
		id: string;
		text: string;
	}[];

	/** Max points allowed for allocation (for budget_allocation) */
	max_points?: number;

	/** Minimum extreme label (for slider) */
	min_label?: string;

	/** Maximum extreme label (for slider) */
	max_label?: string;

	/** The axis ID directly affected (for slider) */
	axis_id?: string;

	/** Demographic and thematic tags for question filtering. */
	tags: string[];
}
