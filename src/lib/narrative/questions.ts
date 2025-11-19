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
export const narrativeQuestions: NarrativeQuestion[] = [
	// ====================
	// Housing & Urban Development
	// ====================
	{
		id: 1,
		story_text: 'Ihre Miete steigt um 25%. Freunde müssen wegziehen.',
		optionA: {
			text: 'Der Vermieter sollte das nicht dürfen',
			impacts: [
				{ axis_id: 'market-state', delta: +2.0 },
				{ axis_id: 'individual-collective', delta: +1.2 }
			]
		},
		optionB: {
			text: 'Ich ziehe woanders hin, wo es günstiger ist',
			impacts: [
				{ axis_id: 'market-state', delta: -1.8 },
				{ axis_id: 'ecology-economy', delta: -0.8 }
			]
		},
		tags: ['housing', 'urban', 'young-professional', 'economic']
	},

	// ====================
	// Climate & Environment
	// ====================
	{
		id: 2,
		story_text: 'Neue Fabrik in Ihrer Region: 5.000 Jobs, aber der Wald muss weg.',
		optionA: {
			text: 'Der Wald bleibt',
			impacts: [
				{ axis_id: 'ecology-economy', delta: +2.5 },
				{ axis_id: 'individual-collective', delta: +0.5 }
			]
		},
		optionB: {
			text: 'Wir brauchen die Jobs',
			impacts: [
				{ axis_id: 'ecology-economy', delta: -2.0 },
				{ axis_id: 'market-state', delta: -0.8 }
			]
		},
		tags: ['climate', 'environment', 'employment', 'rural', 'worker']
	},

	// ====================
	// Education & Family
	// ====================
	{
		id: 3,
		story_text: 'Sie finden keinen Kita-Platz für Ihr Kind.',
		optionA: {
			text: 'Jeder sollte einen Platz garantiert bekommen',
			impacts: [
				{ axis_id: 'market-state', delta: +1.8 },
				{ axis_id: 'individual-collective', delta: +1.5 }
			]
		},
		optionB: {
			text: 'Ich suche mir selbst eine Lösung',
			impacts: [
				{ axis_id: 'market-state', delta: -1.5 },
				{ axis_id: 'individual-collective', delta: -1.0 }
			]
		},
		tags: ['family', 'childcare', 'parent', 'education', 'young-family']
	},

	// ====================
	// Healthcare
	// ====================
	{
		id: 4,
		story_text: 'Drei Monate Wartezeit beim Facharzt. Mit Privatversicherung sofort.',
		optionA: {
			text: 'Wer mehr zahlt, kann auch mehr erwarten',
			impacts: [
				{ axis_id: 'individual-collective', delta: -1.8 },
				{ axis_id: 'market-state', delta: -1.2 }
			]
		},
		optionB: {
			text: 'Alle sollten gleich behandelt werden',
			impacts: [
				{ axis_id: 'individual-collective', delta: +2.0 },
				{ axis_id: 'market-state', delta: +1.0 }
			]
		},
		tags: ['healthcare', 'senior', 'middle-aged', 'equality']
	},

	// ====================
	// Immigration & Integration
	// ====================
	{
		id: 5,
		story_text: 'In Ihrer Nachbarschaft soll eine Moschee gebaut werden.',
		optionA: {
			text: 'Kein Problem, jeder darf seinen Glauben leben',
			impacts: [
				{ axis_id: 'progressive-conservative', delta: -2.2 },
				{ axis_id: 'individual-collective', delta: -0.8 }
			]
		},
		optionB: {
			text: 'Das passt nicht hierher',
			impacts: [
				{ axis_id: 'progressive-conservative', delta: +1.8 },
				{ axis_id: 'individual-collective', delta: +1.0 }
			]
		},
		tags: ['immigration', 'integration', 'religion', 'urban', 'values']
	},

	// ====================
	// Labor & Employment
	// ====================
	{
		id: 6,
		story_text: 'Amazon bietet Ihnen einen Job: Mindestlohn, harte Bedingungen.',
		optionA: {
			text: 'Wenn es mir nicht passt, arbeite ich woanders',
			impacts: [
				{ axis_id: 'market-state', delta: -2.0 },
				{ axis_id: 'individual-collective', delta: -1.0 }
			]
		},
		optionB: {
			text: 'Solche Bedingungen sollten verboten sein',
			impacts: [
				{ axis_id: 'market-state', delta: +1.8 },
				{ axis_id: 'individual-collective', delta: +1.5 }
			]
		},
		tags: ['employment', 'labor', 'worker', 'economy', 'young-worker']
	},

	// ====================
	// Digital & Technology
	// ====================
	{
		id: 7,
		story_text: 'Google und Facebook wissen alles über Sie.',
		optionA: {
			text: 'Das muss verboten werden',
			impacts: [
				{ axis_id: 'market-state', delta: +1.5 },
				{ axis_id: 'individual-collective', delta: +0.8 }
			]
		},
		optionB: {
			text: 'Ich entscheide selbst, was ich nutze',
			impacts: [
				{ axis_id: 'market-state', delta: -1.8 },
				{ axis_id: 'individual-collective', delta: -1.2 }
			]
		},
		tags: ['digital', 'technology', 'privacy', 'young-professional', 'student']
	},

	// ====================
	// Pension & Retirement
	// ====================
	{
		id: 8,
		story_text: 'Mit 67 gehen Sie in Rente. Ihre Rente reicht kaum.',
		optionA: {
			text: 'Ich hätte privat vorsorgen sollen',
			impacts: [
				{ axis_id: 'individual-collective', delta: -2.0 },
				{ axis_id: 'market-state', delta: -1.5 }
			]
		},
		optionB: {
			text: 'Ich habe mein Leben lang eingezahlt',
			impacts: [
				{ axis_id: 'individual-collective', delta: +2.2 },
				{ axis_id: 'market-state', delta: +1.0 }
			]
		},
		tags: ['pension', 'retirement', 'senior', 'middle-aged', 'social-security']
	},

	// ====================
	// Energy & Infrastructure
	// ====================
	{
		id: 9,
		story_text: 'Benzin kostet jetzt 3€ pro Liter. Sie pendeln täglich 50km.',
		optionA: {
			text: 'Gut fürs Klima, ich finde Alternativen',
			impacts: [
				{ axis_id: 'ecology-economy', delta: +2.5 },
				{ axis_id: 'individual-collective', delta: +1.0 }
			]
		},
		optionB: {
			text: 'Das kann ich mir nicht leisten',
			impacts: [
				{ axis_id: 'ecology-economy', delta: -1.5 },
				{ axis_id: 'market-state', delta: +0.8 }
			]
		},
		tags: ['climate', 'energy', 'rural', 'transportation', 'environment']
	},

	// ====================
	// Gender & Equality
	// ====================
	{
		id: 10,
		story_text: 'Ihr Unternehmen führt eine Frauenquote für Führungspositionen ein.',
		optionA: {
			text: 'Endlich echte Gleichberechtigung',
			impacts: [
				{ axis_id: 'market-state', delta: +1.5 },
				{ axis_id: 'progressive-conservative', delta: -1.8 }
			]
		},
		optionB: {
			text: 'Leistung sollte zählen, nicht Geschlecht',
			impacts: [
				{ axis_id: 'market-state', delta: -1.0 },
				{ axis_id: 'progressive-conservative', delta: +1.5 }
			]
		},
		tags: ['equality', 'gender', 'workplace', 'young-professional', 'progressive']
	},

	// ====================
	// Taxation & Wealth
	// ====================
	{
		id: 11,
		story_text: 'Die 10 reichsten Deutschen besitzen mehr als die ärmsten 50 Millionen.',
		optionA: {
			text: 'Reiche sollten mehr Steuern zahlen',
			impacts: [
				{ axis_id: 'market-state', delta: +2.0 },
				{ axis_id: 'individual-collective', delta: +1.8 }
			]
		},
		optionB: {
			text: 'Jeder ist seines Glückes Schmied',
			impacts: [
				{ axis_id: 'market-state', delta: -2.2 },
				{ axis_id: 'individual-collective', delta: -1.5 }
			]
		},
		tags: ['taxation', 'wealth', 'economy', 'equality', 'middle-aged']
	},

	// ====================
	// Education & Merit
	// ====================
	{
		id: 12,
		story_text: 'Ihr Kind bekommt eine Gymnasialempfehlung, aber die Freunde gehen zur Gesamtschule.',
		optionA: {
			text: 'Alle Kinder sollten zusammen lernen',
			impacts: [
				{ axis_id: 'progressive-conservative', delta: -1.8 },
				{ axis_id: 'individual-collective', delta: +1.5 }
			]
		},
		optionB: {
			text: 'Gymnasium ist die beste Chance',
			impacts: [
				{ axis_id: 'progressive-conservative', delta: +1.5 },
				{ axis_id: 'individual-collective', delta: -1.2 }
			]
		},
		tags: ['education', 'equality', 'student', 'parent', 'social-mobility']
	}
];

/**
 * Get a narrative question by its ID
 * @param id - The unique identifier of the question
 * @returns The narrative question with the specified ID, or undefined if not found
 */
export function getNarrativeQuestionById(id: number): NarrativeQuestion | undefined {
	return narrativeQuestions.find((q) => q.id === id);
}

/**
 * Get all narrative questions with a specific tag
 * @param tag - The demographic or thematic tag to filter by
 * @returns Array of questions that include the specified tag
 */
export function getNarrativeQuestionsByTag(tag: string): NarrativeQuestion[] {
	return narrativeQuestions.filter((q) => q.tags.includes(tag));
}

/**
 * Validate the narrative questions data structure
 * Checks that all axis_id references point to valid ideological axes
 * @returns Array of validation errors (empty if valid)
 */
export function validateNarrativeQuestions(): string[] {
	const errors: string[] = [];
	const validAxisIds = ['market-state', 'individual-collective', 'progressive-conservative', 'ecology-economy'];

	narrativeQuestions.forEach((question) => {
		// Validate optionA impacts
		question.optionA.impacts.forEach((impact, index) => {
			if (!validAxisIds.includes(impact.axis_id)) {
				errors.push(
					`Question ${question.id} optionA impact ${index} has invalid axis_id: "${impact.axis_id}"`
				);
			}
		});

		// Validate optionB impacts
		question.optionB.impacts.forEach((impact, index) => {
			if (!validAxisIds.includes(impact.axis_id)) {
				errors.push(
					`Question ${question.id} optionB impact ${index} has invalid axis_id: "${impact.axis_id}"`
				);
			}
		});
	});

	return errors;
}
