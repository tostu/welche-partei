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
		story_text:
			'In Ihrer Stadt steigen die Mieten dramatisch. Viele Menschen können sich ihre Wohnungen nicht mehr leisten und müssen wegziehen. Die Stadtregierung muss handeln.',
		optionA: {
			text: 'Eine strikte Mietpreisbremse einführen, um die Mieten zu deckeln',
			impacts: [
				{ axis_id: 'market-state', delta: +2.0 },
				{ axis_id: 'individual-collective', delta: +1.2 }
			]
		},
		optionB: {
			text: 'Bauvorschriften lockern und mehr Wohnungen bauen lassen, damit der Markt das Problem löst',
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
		story_text:
			'Ein großes Automobilwerk in Ihrer Region will eine neue Fabrik bauen. Das schafft 5.000 Arbeitsplätze, aber bedroht ein wichtiges Naturschutzgebiet.',
		optionA: {
			text: 'Das Naturschutzgebiet hat Vorrang – die Fabrik sollte woanders gebaut werden',
			impacts: [
				{ axis_id: 'ecology-economy', delta: +2.5 },
				{ axis_id: 'individual-collective', delta: +0.5 }
			]
		},
		optionB: {
			text: 'Die Arbeitsplätze sind wichtiger – mit Ausgleichsmaßnahmen kann man die Natur schützen',
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
		story_text:
			'Die Kita-Plätze in Ihrer Gemeinde reichen nicht aus. Viele Eltern finden keinen Betreuungsplatz für ihre Kinder. Es gibt zwei Lösungsvorschläge.',
		optionA: {
			text: 'Der Staat sollte massiv in öffentliche Kitas investieren, um allen ein Angebot zu garantieren',
			impacts: [
				{ axis_id: 'market-state', delta: +1.8 },
				{ axis_id: 'individual-collective', delta: +1.5 }
			]
		},
		optionB: {
			text: 'Eltern sollten Gutscheine bekommen und selbst entscheiden, ob sie öffentliche oder private Kitas nutzen',
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
		story_text:
			'Die Wartezeiten für Arzttermine werden immer länger. Manche Patienten warten Monate auf einen Termin beim Facharzt. Die Gesundheitspolitik muss reformiert werden.',
		optionA: {
			text: 'Private Zusatzversicherungen sollten erlaubt bleiben – wer zahlt, bekommt schneller einen Termin',
			impacts: [
				{ axis_id: 'individual-collective', delta: -1.8 },
				{ axis_id: 'market-state', delta: -1.2 }
			]
		},
		optionB: {
			text: 'Alle Patienten sollten gleich behandelt werden – private Vorteile abschaffen',
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
		story_text:
			'In Ihrer Stadt wollen Geflüchtete eine Moschee bauen. Einige Anwohner protestieren und berufen sich auf "christliche Tradition". Der Stadtrat muss entscheiden.',
		optionA: {
			text: 'Religionsfreiheit gilt für alle – die Moschee sollte genehmigt werden',
			impacts: [
				{ axis_id: 'progressive-conservative', delta: -2.2 },
				{ axis_id: 'individual-collective', delta: -0.8 }
			]
		},
		optionB: {
			text: 'Die lokale Tradition sollte respektiert werden – erstmal Dialog mit Anwohnern',
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
		story_text:
			'Ein großer Online-Händler will in Ihrer Region ein Verteilzentrum eröffnen. Die Arbeitsbedingungen sind hart, die Bezahlung am gesetzlichen Minimum. Aber es entstehen 800 Jobs.',
		optionA: {
			text: 'Der Arbeitsmarkt regelt das – wenn die Bedingungen schlecht sind, finden sie keine Mitarbeiter',
			impacts: [
				{ axis_id: 'market-state', delta: -2.0 },
				{ axis_id: 'individual-collective', delta: -1.0 }
			]
		},
		optionB: {
			text: 'Strengere Auflagen für Arbeitsbedingungen und Bezahlung müssen durchgesetzt werden',
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
		story_text:
			'Große Tech-Konzerne sammeln massiv persönliche Daten ihrer Nutzer. Manche fordern strengere Regulierung, andere warnen vor Innovationsbremse.',
		optionA: {
			text: 'Datenschutz ist Grundrecht – der Staat muss die Konzerne streng regulieren',
			impacts: [
				{ axis_id: 'market-state', delta: +1.5 },
				{ axis_id: 'individual-collective', delta: +0.8 }
			]
		},
		optionB: {
			text: 'Jeder kann selbst entscheiden, welche Dienste er nutzt – zu viel Regulierung schadet der Wirtschaft',
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
		story_text:
			'Das Rentensystem steht vor dem Kollaps. Immer weniger Erwerbstätige müssen immer mehr Rentner finanzieren. Eine grundlegende Reform ist nötig.',
		optionA: {
			text: 'Private Altersvorsorge stärken – jeder sollte selbst für seine Rente verantwortlich sein',
			impacts: [
				{ axis_id: 'individual-collective', delta: -2.0 },
				{ axis_id: 'market-state', delta: -1.5 }
			]
		},
		optionB: {
			text: 'Solidarisches Rentensystem erhalten – höhere Beiträge und Steuern für sichere Renten',
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
		story_text:
			'Um die Klimaziele zu erreichen, sollen die Benzinpreise deutlich steigen. Das trifft besonders Menschen auf dem Land, die auf das Auto angewiesen sind.',
		optionA: {
			text: 'Klimaschutz geht vor – höhere Preise sind notwendig, auch wenn es wehtut',
			impacts: [
				{ axis_id: 'ecology-economy', delta: +2.5 },
				{ axis_id: 'individual-collective', delta: +1.0 }
			]
		},
		optionB: {
			text: 'Soziale Härten vermeiden – erst bessere Alternativen schaffen, dann Preise erhöhen',
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
		story_text:
			'In Führungspositionen großer Unternehmen sind Frauen stark unterrepräsentiert. Es gibt verschiedene Vorschläge, das zu ändern.',
		optionA: {
			text: 'Verbindliche Frauenquote einführen – nur so gibt es echte Gleichstellung',
			impacts: [
				{ axis_id: 'market-state', delta: +1.5 },
				{ axis_id: 'progressive-conservative', delta: -1.8 }
			]
		},
		optionB: {
			text: 'Leistung sollte zählen, nicht das Geschlecht – Quoten sind Diskriminierung',
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
		story_text:
			'Die Vermögensungleichheit in Deutschland wächst. Die reichsten 10% besitzen über 60% des Vermögens. Soll der Staat eingreifen?',
		optionA: {
			text: 'Vermögensteuer und höhere Erbschaftssteuer einführen, um Ungleichheit zu reduzieren',
			impacts: [
				{ axis_id: 'market-state', delta: +2.0 },
				{ axis_id: 'individual-collective', delta: +1.8 }
			]
		},
		optionB: {
			text: 'Wer erfolgreich ist, sollte die Früchte ernten – hohe Steuern bremsen Leistungsbereitschaft',
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
		story_text:
			'An deutschen Gymnasien sind Kinder aus Akademikerfamilien stark überrepräsentiert. Arbeiterkinder haben deutlich schlechtere Bildungschancen.',
		optionA: {
			text: 'Gesamtschulen statt dreigliedriges System – alle Kinder gemeinsam fördern',
			impacts: [
				{ axis_id: 'progressive-conservative', delta: -1.8 },
				{ axis_id: 'individual-collective', delta: +1.5 }
			]
		},
		optionB: {
			text: 'Das Gymnasium soll Leistungselite fördern – Begabung zählt, nicht Herkunft',
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
