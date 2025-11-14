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
		text: 'Wie hoch ist Ihr monatliches Bruttoeinkommen?',
		category: 'einkommen',
		answers: [
			{ text: 'Unter 3.000 €', answer: 'niedrig', icon: 'tabler--currency-euro' },
			{ text: '3.000–5.000 €', answer: 'mittel', icon: 'tabler--wallet' },
			{ text: '5.000–6.500 €', answer: 'hoch', icon: 'tabler--coins' },
			{ text: 'Über 6.500 €', answer: 'sehr_hoch', icon: 'tabler--moneybag' }
		]
	},
	{
		id: 3,
		text: 'Welche Lebenssituation beschreibt Sie am besten?',
		category: 'lebenssituation',
		answers: [
			{ text: 'Erwerbstätig', answer: 'erwerbstaetig', icon: 'tabler--briefcase' },
			{ text: 'Selbstständig', answer: 'selbstständig', icon: 'tabler--tie' },
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
			{ text: 'Alleinerziehend', answer: 'alleinerziehend', icon: 'tabler--user-heart' }
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
	},
	{
		id: 6,
		text: 'Wie wichtig ist Ihnen Klimaschutz?',
		category: 'klima',
		answers: [
			{
				text: 'Ist mir egal',
				answer: 'egal',
				icon: 'tabler--circle-off'
			},
			{
				text: 'Solange es mich nicht beeinträchtigt',
				answer: 'passiv',
				icon: 'tabler--hand-stop'
			},
			{
				text: 'Wichtig, aber nicht meine Priorität',
				answer: 'mittel',
				icon: 'tabler--adjustments-horizontal'
			},
			{
				text: 'Sehr wichtig – ich richte mein Verhalten danach aus',
				answer: 'aktiv',
				icon: 'tabler--leaf'
			}
		]
	},
	{
		id: 7,
		text: 'Wie stark belasten Sie Kosten für Gesundheit und Pflege?',
		category: 'gesundheitskosten',
		answers: [
			{
				text: 'Gar nicht – alles problemlos finanzierbar',
				answer: 'keine_belastung',
				icon: 'tabler--heart-handshake'
			},
			{
				text: 'Wenig – manchmal muss ich aufs Geld achten',
				answer: 'gering',
				icon: 'tabler--heart'
			},
			{
				text: 'Spürbar – ich muss bei Behandlungen abwägen',
				answer: 'mittel',
				icon: 'tabler--heart-minus'
			},
			{
				text: 'Stark – Zuzahlungen sind schwierig',
				answer: 'hoch',
				icon: 'tabler--heart-broken'
			},
			{
				text: 'Existenziell – ich verzichte auf Behandlungen',
				answer: 'sehr_hoch',
				icon: 'tabler--heart-off'
			}
		]
	},
	{
		id: 8,
		text: 'Wie sicher fühlen Sie sich in Ihrer Arbeitssituation?',
		category: 'arbeitssicherheit',
		answers: [
			{
				text: 'Sehr sicher – unbefristeter Vertrag',
				answer: 'sicher',
				icon: 'tabler--shield-check'
			},
			{
				text: 'Etwas unsicher – Zukunft unklar',
				answer: 'unsicher',
				icon: 'tabler--shield'
			},
			{
				text: 'Prekär – Befristungen, Minijobs',
				answer: 'befristet_prekär',
				icon: 'tabler--shield-x'
			},
			{
				text: 'Existenzangst – drohende Arbeitslosigkeit',
				answer: 'existenzangst',
				icon: 'tabler--shield-off'
			}
		]
	},
	{
		id: 9,
		text: 'Wie bewerten Sie den Zugang zu Bildung für sich oder Ihre Familie?',
		category: 'bildungszugang',
		answers: [
			{
				text: 'Sehr gut – alle Möglichkeiten offen',
				answer: 'sehr_gut',
				icon: 'tabler--award'
			},
			{
				text: 'Gut – weitestgehend zufrieden',
				answer: 'gut',
				icon: 'tabler--certificate'
			},
			{
				text: 'Eingeschränkt – nicht alle Wünsche erfüllbar',
				answer: 'eingeschränkt',
				icon: 'tabler--book'
			},
			{
				text: 'Schlecht – finanzielle oder strukturelle Hürden',
				answer: 'schlecht',
				icon: 'tabler--book-off'
			}
		]
	},
	{
		id: 10,
		text: 'Sind Sie oder Ihre Familie von Pflege betroffen?',
		category: 'pflege',
		answers: [
			{
				text: 'Nein, kein Thema',
				answer: 'nicht_betroffen',
				icon: 'tabler--circle-check'
			},
			{
				text: 'Nein, aber ich mache mir Sorgen',
				answer: 'zukunft',
				icon: 'tabler--clock'
			},
			{
				text: 'Ja, ich pflege oder organisiere Pflege',
				answer: 'aktuell_familienmitglied',
				icon: 'tabler--heart-handshake'
			},
			{
				text: 'Ja, ich bin selbst pflegebedürftig',
				answer: 'selbst_pflegebedürftig',
				icon: 'tabler--accessible'
			}
		]
	},
	{
		id: 11,
		text: 'Wie wichtig ist Ihnen digitale Infrastruktur (Internet, Online-Behörden)?',
		category: 'digitalisierung',
		answers: [
			{
				text: 'Unwichtig – brauche ich kaum',
				answer: 'unwichtig',
				icon: 'tabler--wifi-off'
			},
			{
				text: 'Etwas wichtig – nutze es gelegentlich',
				answer: 'etwas_wichtig',
				icon: 'tabler--wifi-1'
			},
			{
				text: 'Wichtig – nutze es regelmäßig',
				answer: 'wichtig',
				icon: 'tabler--wifi-2'
			},
			{
				text: 'Sehr wichtig – bin darauf angewiesen',
				answer: 'sehr_wichtig',
				icon: 'tabler--wifi'
			}
		]
	},
	{
		id: 12,
		text: 'Wie wichtig ist öffentlicher Nahverkehr für Sie?',
		category: 'oeffentlicher_verkehr',
		answers: [
			{
				text: 'Nicht nötig – ich fahre Auto',
				answer: 'nicht_nötig',
				icon: 'tabler--car'
			},
			{
				text: 'Gelegentlich – als Alternative praktisch',
				answer: 'gelegentlich',
				icon: 'tabler--bus'
			},
			{
				text: 'Regelmäßig – wichtig für meinen Alltag',
				answer: 'regelmäßig',
				icon: 'tabler--train'
			},
			{
				text: 'Täglich – ich bin darauf angewiesen',
				answer: 'täglich_angewiesen',
				icon: 'tabler--urgent'
			}
		]
	},
	{
		id: 13,
		text: 'Wie blicken Sie auf Ihre persönliche Zukunft?',
		category: 'zukunftsangst',
		answers: [
			{
				text: 'Optimistisch – ich sehe gute Chancen',
				answer: 'optimistisch',
				icon: 'tabler--sun'
			},
			{
				text: 'Neutral – mal sehen was kommt',
				answer: 'neutral',
				icon: 'tabler--minus'
			},
			{
				text: 'Besorgt – unsichere Zeiten',
				answer: 'besorgt',
				icon: 'tabler--cloud'
			},
			{
				text: 'Große Angst – ich fürchte die Zukunft',
				answer: 'große_angst',
				icon: 'tabler--cloud-storm'
			}
		]
	}
];
