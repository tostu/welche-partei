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
export const profilingQuestions: ProfilingQuestion[] = [
	// ====================
	// START: Age Group Question
	// ====================
	{
		id: 'age-group',
		category: 'demographics',
		text: 'Zu welcher Altersgruppe gehören Sie?',
		answers: [
			{
				text: 'Unter 30 Jahre',
				value: 'under-30',
				next_question_id: 'employment-status-young'
			},
			{
				text: '30-50 Jahre',
				value: '30-50',
				next_question_id: 'employment-status-mid'
			},
			{
				text: 'Über 50 Jahre',
				value: 'over-50',
				next_question_id: 'retirement-status'
			}
		]
	},

	// ====================
	// BRANCH 1: Under 30 Path
	// ====================
	{
		id: 'employment-status-young',
		category: 'demographics',
		text: 'Was beschreibt Ihre aktuelle Situation am besten?',
		answers: [
			{
				text: 'Ich bin Student/in oder in Ausbildung',
				value: 'student',
				next_question_id: 'student-priorities'
			},
			{
				text: 'Ich arbeite (angestellt oder selbstständig)',
				value: 'employed',
				next_question_id: 'young-worker-priorities'
			},
			{
				text: 'Ich suche Arbeit',
				value: 'unemployed',
				next_question_id: 'young-worker-priorities'
			}
		]
	},
	{
		id: 'student-priorities',
		category: 'priorities',
		text: 'Was ist Ihnen als Student/in am wichtigsten?',
		answers: [
			{
				text: 'Bezahlbares Wohnen und BAföG-Reform',
				value: 'housing-bafög'
				// No next_question_id - this is a terminal node (end of profiling)
			},
			{
				text: 'Klimaschutz und Zukunftsperspektiven',
				value: 'climate-future'
			},
			{
				text: 'Digitalisierung und Bildungsreformen',
				value: 'digital-education'
			}
		]
	},
	{
		id: 'young-worker-priorities',
		category: 'priorities',
		text: 'Welches Thema betrifft Sie aktuell am meisten?',
		answers: [
			{
				text: 'Faire Löhne und Arbeitsbedingungen',
				value: 'fair-wages'
			},
			{
				text: 'Work-Life-Balance und Familie',
				value: 'work-life-balance'
			},
			{
				text: 'Aufstiegschancen und Weiterbildung',
				value: 'career-advancement'
			}
		]
	},

	// ====================
	// BRANCH 2: 30-50 Age Path
	// ====================
	{
		id: 'employment-status-mid',
		category: 'demographics',
		text: 'Wie sieht Ihre berufliche Situation aus?',
		answers: [
			{
				text: 'Ich bin angestellt',
				value: 'employed',
				next_question_id: 'working-priorities'
			},
			{
				text: 'Ich bin selbstständig',
				value: 'self-employed',
				next_question_id: 'economic-concerns'
			},
			{
				text: 'Ich bin arbeitssuchend',
				value: 'unemployed',
				next_question_id: 'economic-concerns'
			}
		]
	},
	{
		id: 'working-priorities',
		category: 'priorities',
		text: 'Was ist Ihnen in dieser Lebensphase besonders wichtig?',
		answers: [
			{
				text: 'Kinderbetreuung und Familienförderung',
				value: 'childcare-family'
			},
			{
				text: 'Altersvorsorge und finanzielle Sicherheit',
				value: 'pension-security'
			},
			{
				text: 'Berufliche Entwicklung und Stabilität',
				value: 'career-stability'
			}
		]
	},
	{
		id: 'economic-concerns',
		category: 'priorities',
		text: 'Welche wirtschaftlichen Fragen beschäftigen Sie am meisten?',
		answers: [
			{
				text: 'Steuern und Bürokratieabbau',
				value: 'taxes-bureaucracy'
			},
			{
				text: 'Soziale Absicherung und Arbeitslosenunterstützung',
				value: 'social-security'
			},
			{
				text: 'Wirtschaftsförderung und Innovation',
				value: 'economic-innovation'
			}
		]
	},

	// ====================
	// BRANCH 3: Over 50 Age Path
	// ====================
	{
		id: 'retirement-status',
		category: 'demographics',
		text: 'Sind Sie bereits im Ruhestand?',
		answers: [
			{
				text: 'Ja, ich bin im Ruhestand',
				value: 'retired',
				next_question_id: 'retirement-priorities'
			},
			{
				text: 'Nein, ich arbeite noch',
				value: 'working',
				next_question_id: 'senior-working-priorities'
			}
		]
	},
	{
		id: 'retirement-priorities',
		category: 'priorities',
		text: 'Was ist Ihnen als Rentner/in am wichtigsten?',
		answers: [
			{
				text: 'Rentenhöhe und Alterssicherheit',
				value: 'pension-amount'
			},
			{
				text: 'Gesundheitsversorgung und Pflege',
				value: 'healthcare-care'
			},
			{
				text: 'Enkelkinder-Zukunft und Umweltschutz',
				value: 'grandchildren-environment'
			}
		]
	},
	{
		id: 'senior-working-priorities',
		category: 'priorities',
		text: 'Was beschäftigt Sie in den Jahren vor dem Ruhestand?',
		answers: [
			{
				text: 'Übergang in den Ruhestand und Rente',
				value: 'retirement-transition'
			},
			{
				text: 'Gesundheit und Arbeitsbelastung',
				value: 'health-workload'
			},
			{
				text: 'Absicherung für die Familie',
				value: 'family-security'
			}
		]
	}
];

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
		question.answers.forEach((answer, index) => {
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
