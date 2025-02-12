import type { Category, Answer } from '$lib/categories';

export interface Question {
	id: number;
	text: string;
	category: Category;
	answers: { text: string; answer: Answer<Category>; icon: string }[];
}

export const questions: Question[] = [
	{
		id: 1,
		text: 'Wie ist Ihre Wohnsituation?',
		category: 'wohnen',
		answers: [
			{ text: 'Mieter:in', answer: 'miete', icon: 'tabler--home' },
			{ text: 'Eigentümer:in', answer: 'eigentum', icon: 'tabler--key' }
		]
	},
	{
		id: 2,
		text: 'Wie hoch ist Ihr monatliches Nettoeinkommen?',
		category: 'einkommen',
		answers: [
			{ text: 'Unter 1.500 €', answer: 'niedrig', icon: 'tabler--currency-euro' },
			{ text: '1.500–3.500 €', answer: 'mittel', icon: 'tabler--wallet' },
			{ text: 'Über 3.500 €', answer: 'hoch', icon: 'tabler--chart-bar' }
		]
	},
	{
		id: 3,
		text: 'Welche Lebenssituation beschreibt Sie am besten?',
		category: 'lebenssituation',
		answers: [
			{ text: 'Erwerbstätig', answer: 'erwerbstaetig', icon: 'tabler--briefcase' },
			{ text: 'Selbstständig', answer: 'selbstständig', icon: 'tabler--business' },
			{
				text: 'Studierend oder in Ausbildung',
				answer: 'studierend_auszubildend',
				icon: 'tabler--school'
			},
			{
				text: 'Arbeitslos oder in Übergangsphase',
				answer: 'arbeitslos_uebergangsphase',
				icon: 'tabler--user-x'
			}
		]
	},
	{
		id: 4,
		text: 'Wie ist Ihre Familiensituation?',
		category: 'familie',
		answers: [
			{ text: 'Keine Kinder', answer: 'kinderlos', icon: 'tabler--user' },
			{ text: 'Mit Kindern', answer: 'elternteil', icon: 'tabler--users' },
			{ text: 'Alleinerziehend', answer: 'alleinerziehend', icon: 'tabler--user-check' }
		]
	},
	{
		id: 5,
		text: 'Wo leben Sie überwiegend?',
		category: 'urbanisierung',
		answers: [
			{ text: 'In einer Großstadt', answer: 'grossstadt', icon: 'tabler--building-skyscraper' },
			{ text: 'In einem ländlichen Gebiet', answer: 'laendlich', icon: 'tabler--trees' }
		]
	}
];
