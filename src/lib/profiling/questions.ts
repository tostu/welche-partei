import type { ProfilingQuestion } from './types';

/**
 * Profiling Questions
 *
 * A collection of dynamic profiling questions with conditional branching logic.
 * These questions help personalize the quiz experience by understanding the user's
 * demographics, priorities, and context before presenting narrative ideology questions.
 *
 * **Question Tree Structure:**
 * ```
 * age-group (START)
 * ├─→ under-30 → employment-status-young
 * │   ├─→ student → student-priorities (END)
 * │   └─→ employed/unemployed → young-worker-priorities (END)
 * ├─→ 30-50 → employment-status-mid
 * │   ├─→ employed → working-priorities (END)
 * │   └─→ unemployed/self-employed → economic-concerns (END)
 * └─→ over-50 → retirement-status
 *     ├─→ working → senior-working-priorities (END)
 *     └─→ retired → retirement-priorities (END)
 * ```
 *
 * This demonstrates:
 * - Branching based on age group (3 paths)
 * - Further branching based on employment status (different questions per age group)
 * - Multiple terminal nodes (various priority questions based on user profile)
 */
import profilingQuestionsData from './questions.json';

export const profilingQuestions: ProfilingQuestion[] = profilingQuestionsData as ProfilingQuestion[];


/**
 * Get the starting question for the profiling section
 * @returns The first question in the profiling quiz
 */
export function getStartingQuestion(): ProfilingQuestion {
	const startQuestion = profilingQuestions.find((q) => q.id === 'age-group');
	if (!startQuestion) {
		throw new Error('Starting question "age-group" not found in profilingQuestions');
	}
	return startQuestion;
}

/**
 * Get a question by its ID
 * @param id - The unique identifier of the question
 * @returns The profiling question with the specified ID, or undefined if not found
 */
export function getQuestionById(id: string): ProfilingQuestion | undefined {
	return profilingQuestions.find((q) => q.id === id);
}

/**
 * Validate the question tree structure
 * Checks that all next_question_id references point to valid questions
 * @returns Array of validation errors (empty if valid)
 */
export function validateQuestionTree(): string[] {
	const errors: string[] = [];
	const questionIds = new Set(profilingQuestions.map((q) => q.id));

	profilingQuestions.forEach((question) => {
		// Check default_next_question_id
		if (question.default_next_question_id) {
			if (!questionIds.has(question.default_next_question_id)) {
				errors.push(
					`Question "${question.id}" has invalid default_next_question_id: "${question.default_next_question_id}"`
				);
			}
		}

		// Check each answer's next_question_id
		question.answers?.forEach((answer, index) => {
			if (answer.next_question_id) {
				if (!questionIds.has(answer.next_question_id)) {
					errors.push(
						`Question "${question.id}" answer ${index} ("${answer.text}") has invalid next_question_id: "${answer.next_question_id}"`
					);
				}
			}
		});
	});

	return errors;
}
