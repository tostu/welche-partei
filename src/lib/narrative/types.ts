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
	 * Each impact specifies which axis is affected and by how much (delta).
	 */
	impacts: NarrativeAnswerImpact[];
}

/**
 * Narrative Question
 *
 * Represents a narrative dilemma question in the ideology quiz.
 * Presents a story scenario with two answer options, where each option
 * affects the user's ideological profile differently.
 *
 * **Structure:**
 * - Engaging story scenario (`story_text`)
 * - Two answer options (A and B), each with ideological impacts
 * - Demographic tags for personalized question selection
 *
 * **Design Principles:**
 * - Questions should present realistic, relatable dilemmas
 * - Options should represent genuine ideological trade-offs
 * - Impacts should be balanced (not all options push in same direction)
 * - Tags enable demographic-based question filtering
 *
 * @example
 * ```typescript
 * const question: NarrativeQuestion = {
 *   id: 1,
 *   story_text: 'In Ihrer Stadt steigen die Mieten stark...',
 *   optionA: {
 *     text: 'Mietpreisbremse einführen',
 *     impacts: [{ axis_id: 'market-state', delta: +1.5 }]
 *   },
 *   optionB: {
 *     text: 'Mehr Wohnungen bauen',
 *     impacts: [{ axis_id: 'market-state', delta: -1.2 }]
 *   },
 *   tags: ['urban', 'housing', 'young-professional']
 * };
 * ```
 */
export interface NarrativeQuestion {
	/** Unique numeric identifier for the question */
	id: number;

	/**
	 * The story text presenting the dilemma scenario.
	 * Should be engaging, realistic, and relatable to the target demographic.
	 */
	story_text: string;

	/** First answer option (typically represents one ideological perspective) */
	optionA: NarrativeAnswerOption;

	/** Second answer option (typically represents an opposing ideological perspective) */
	optionB: NarrativeAnswerOption;

	/**
	 * Demographic and thematic tags for question filtering.
	 * Examples: 'homeowner', 'parent', 'student', 'climate', 'economy'
	 * Used to select personalized questions based on profiling answers.
	 */
	tags: string[];
}
