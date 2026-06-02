import type { NarrativeQuestion } from './types';

/**
 * Narrative Questions Bank
 *
 * A collection of narrative dilemma questions for the ideology quiz.
 * Each question presents a realistic scenario with two answer options,
 * where each option affects the user's ideological profile differently.
 *
 * **Question Design Principles:**
 * - Questions present relatable, real-world dilemmas
 * - Options represent genuine ideological trade-offs (not obvious good/bad choices)
 * - Impacts are balanced across different ideological dimensions
 * - Tags enable demographic-based personalization
 * - All content in German for authentic German political quiz experience
 *
 * **Ideological Axes:**
 * - market-state: Free market vs. state intervention (1=market, 10=state)
 * - individual-collective: Individual freedom vs. collective responsibility (1=individual, 10=collective)
 * - progressive-conservative: Progressive change vs. traditional values (1=progressive, 10=conservative)
 * - ecology-economy: Economic growth vs. ecological protection (1=economy, 10=ecology)
 *
 * **Delta Guidelines:**
 * - Small impact: ±0.5 to ±1.0
 * - Medium impact: ±1.0 to ±2.0
 * - Large impact: ±2.0 to ±3.0
 * - Most questions should use small to medium impacts
 */
import narrativeQuestionsData from './questions.json';

export const narrativeQuestions: NarrativeQuestion[] = narrativeQuestionsData as NarrativeQuestion[];


/**
 * Get a narrative question by its ID
 */
export function getNarrativeQuestionById(id: number): NarrativeQuestion | undefined {
	return narrativeQuestions.find((q) => q.id === id);
}

/**
 * Get all narrative questions with a specific tag
 */
export function getNarrativeQuestionsByTag(tag: string): NarrativeQuestion[] {
	return narrativeQuestions.filter((q) => q.tags.includes(tag));
}

/**
 * Validate the narrative questions data structure
 */
export function validateNarrativeQuestions(): string[] {
	const errors: string[] = [];
	const validAxisIds = [
		'market-state',
		'individual-collective',
		'progressive-conservative',
		'ecology-economy',
		'privacy-comfort'
	];

	narrativeQuestions.forEach((question) => {
		// Validate optionA impacts
		question.optionA?.impacts.forEach((impact, index) => {
			if (!validAxisIds.includes(impact.axis_id)) {
				errors.push(
					`Question ${question.id} optionA impact ${index} has invalid axis_id: "${impact.axis_id}"`
				);
			}
		});

		// Validate optionB impacts
		question.optionB?.impacts.forEach((impact, index) => {
			if (!validAxisIds.includes(impact.axis_id)) {
				errors.push(
					`Question ${question.id} optionB impact ${index} has invalid axis_id: "${impact.axis_id}"`
				);
			}
		});

		// Validate answers impacts (new format)
		question.answers?.forEach((answer, answerIndex) => {
			answer.impacts?.forEach((impact, impactIndex) => {
				if (!validAxisIds.includes(impact.axis_id)) {
					errors.push(
						`Question ${question.id} answer ${answerIndex} impact ${impactIndex} has invalid axis_id: "${impact.axis_id}"`
					);
				}
			});
		});
	});

	return errors;
}