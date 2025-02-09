import type { Category, Answer } from '$lib/categories';

export interface Question {
	id: number;
	text: string;
	category: Category;
	answers: { text: string; answer:  Answer<Category>; icon: string }[];
}

export const questions: Question[] = [
	{
		id: 1,
		text: 'Wie ist Ihre Wohnsituation?',
		category: 'wohnen',
		answers: [
			{ text: 'Zur Miete', answer: 'miete', icon: 'tabler--home' },
			{ text: 'Eigentümer', answer: 'eigentum', icon: 'tabler--key' }
		]
	},
	{
		id: 2,
		text: 'Wie hoch ist Ihr monatliches Nettoeinkommen?',
		category: 'einkommen',
		answers: [
			{ text: 'Unter 2.000 €', answer: 'niedrig', icon: 'tabler--currency-euro' },
			{ text: '2.000–4.000 €', answer: 'mittel', icon: 'tabler--wallet' },
			{ text: 'Über 4.000 €', answer: 'hoch', icon: 'tabler--chart-bar' }
		]
	},
	{
		id: 3,
		text: 'Welche Lebenssituation beschreibt Sie am besten?',
		category: 'lebenssituation',
		answers: [
			{ text: 'Alleinerziehend', answer: 'alleinerziehend', icon: 'tabler--user' },
			{ text: 'Wohnungslos', answer: 'wohnungslos', icon: 'tabler--home-off' },
			{ text: 'Studierend', answer: 'studierend', icon: 'tabler--school' },
			{ text: 'In Ausbildung', answer: 'auszubildend', icon: 'tabler--briefcase' }
		]
	},
	{
		id: 4,
		text: 'Wo leben Sie überwiegend?',
		category: 'urbanisierung',
		answers: [
			{ text: 'In einer Großstadt', answer: 'grossstadt', icon: 'tabler--building-skyscraper' },
			{ text: 'In einem ländlichen Gebiet', answer: 'laendlich', icon: 'tabler--trees' }
		]
	},
	// {
	// 	id: 5,
	// 	text: 'Welche politische Priorität ist Ihnen am wichtigsten?',
	// 	category: 'prioritaet',
	// 	answers: [
	// 		{ text: 'Soziale Gerechtigkeit', answer: 'soziale_gerechtigkeit', icon: 'tabler--scale' },
	// 		{ text: 'Klimapolitik', answer: 'klimapolitik', icon: 'tabler--leaf' },
	// 		{ text: 'Steuerentlastung', answer: 'steuerentlastung', icon: 'tabler--percentage' },
	// 		{ text: 'Infrastruktur', answer: 'infrastruktur', icon: 'tabler--road' },
	// 		{ text: 'Eigentumsförderung', answer: 'eigentumsfoerderung', icon: 'tabler--home' },
	// 		{ text: 'Marktlösungen', answer: 'marktloesungen', icon: 'tabler--chart-line' }
	// 	]
	// }
];
