import type { Category, Answer } from '$lib/categories';
import type { Party } from '$lib/parties';

// Erweiterte Kategorien mit Lebenswelt-Bezug
type ExtendedCategory =
	| Category
	| 'gesundheitskosten' // Wie belastet sind Sie durch Gesundheitskosten?
	| 'arbeitssicherheit' // Wie sicher fühlen Sie sich in Ihrem Job?
	| 'bildungszugang' // Haben Sie/Ihre Kinder Zugang zu guter Bildung?
	| 'pflege' // Sind Sie/Familie von Pflege betroffen?
	| 'digitalisierung' // Wie wichtig ist Ihnen digitale Infrastruktur?
	| 'oeffentlicher_verkehr' // Wie wichtig ist ÖPNV für Sie?
	| 'zukunftsangst'; // Wie blicken Sie in die Zukunft?

type PartyWeights = {
	[P in Party]: {
		[C in ExtendedCategory]?: Partial<Record<Answer<C>, number>>;
	};
};

export const partyWeights: PartyWeights = {
	AFD: {
		// Wohnen
		wohnen: {
			miete: 2, // Kaum Mieterschutz-Konzepte
			eigentum: 5 // Rhetorik ja, aber keine konkreten Hilfen für Normalverdiener
		},

		// Einkommen - ihre Politik hilft fast nur Reichen
		einkommen: {
			niedrig: 1, // Gegen Mindestlohn-Erhöhung, gegen Sozialleistungen
			mittel: 2, // Steuerpolitik hilft Mittelschicht kaum
			hoch: 7,
			sehr_hoch: 9
		},

		// Lebenssituation
		lebenssituation: {
			erwerbstaetig: 4,
			selbstständig: 5,
			studierend_auszubildend: 2, // Bildungspolitik rückwärtsgewandt
			arbeitslos_uebergangsphase: 1 // Gegen soziale Absicherung
		},

		// Familie
		familie: {
			kinderlos: 3,
			elternteil: 5, // Traditionelles Familienbild
			alleinerziehend: 1 // Keine Unterstützung für "nicht-traditionelle" Familien
		},

		// Urbanisierung
		urbanisierung: {
			grossstadt: 2, // Anti-urban Rhetorik
			laendlich: 7 // Fokus auf ländliche Identität
		},

		// Klima
		klima: {
			egal: 10,
			passiv: 7,
			mittel: 3,
			aktiv: 1
		},

		// NEU: Gesundheitskosten
		gesundheitskosten: {
			keine_belastung: 8, // Privatisierung hilft nur Reichen
			gering: 5,
			mittel: 2,
			hoch: 1, // Gegen solidarisches Gesundheitssystem
			sehr_hoch: 1
		},

		// NEU: Arbeitssicherheit
		arbeitssicherheit: {
			sicher: 7, // Besitzstandswahrung
			unsicher: 3, // Gegen Kündigungsschutz
			befristet_prekär: 2, // Für "flexible" Arbeitsmärkte
			existenzangst: 1
		},

		// NEU: Bildungszugang
		bildungszugang: {
			sehr_gut: 7,
			gut: 5,
			eingeschränkt: 2, // Gegen Bildungsaufstieg
			schlecht: 1 // Dreigliedriges System zementiert Unterschiede
		},

		// NEU: Pflege
		pflege: {
			nicht_betroffen: 5,
			zukunft: 3,
			aktuell_familienmitglied: 2, // Keine konkreten Verbesserungen
			selbst_pflegebedürftig: 1
		},

		// NEU: Digitalisierung
		digitalisierung: {
			unwichtig: 8,
			etwas_wichtig: 5,
			wichtig: 3,
			sehr_wichtig: 2 // Rückwärtsgewandt, gegen Investitionen
		},

		// NEU: ÖPNV
		oeffentlicher_verkehr: {
			nicht_nötig: 8, // Pro Auto
			gelegentlich: 5,
			regelmäßig: 2,
			täglich_angewiesen: 1 // Gegen ÖPNV-Ausbau
		},

		// NEU: Zukunftsangst
		zukunftsangst: {
			optimistisch: 4,
			neutral: 5,
			besorgt: 8, // Schürt Ängste
			große_angst: 9 // Profitiert von Angst
		}
	},

	BSW: {
		wohnen: { miete: 8, eigentum: 4 },
		einkommen: { niedrig: 8, mittel: 7, hoch: 4, sehr_hoch: 3 },
		lebenssituation: {
			erwerbstaetig: 7,
			selbstständig: 5,
			studierend_auszubildend: 6,
			arbeitslos_uebergangsphase: 8
		},
		familie: { kinderlos: 6, elternteil: 7, alleinerziehend: 7 },
		urbanisierung: { grossstadt: 6, laendlich: 6 },
		klima: { egal: 4, passiv: 5, mittel: 6, aktiv: 5 },
		gesundheitskosten: {
			keine_belastung: 3,
			gering: 5,
			mittel: 8,
			hoch: 9,
			sehr_hoch: 9
		},
		arbeitssicherheit: {
			sicher: 6,
			unsicher: 7,
			befristet_prekär: 8,
			existenzangst: 8
		},
		bildungszugang: {
			sehr_gut: 5,
			gut: 6,
			eingeschränkt: 8,
			schlecht: 9
		},
		pflege: {
			nicht_betroffen: 5,
			zukunft: 6,
			aktuell_familienmitglied: 8,
			selbst_pflegebedürftig: 9
		},
		digitalisierung: {
			unwichtig: 5,
			etwas_wichtig: 6,
			wichtig: 7,
			sehr_wichtig: 6
		},
		oeffentlicher_verkehr: {
			nicht_nötig: 4,
			gelegentlich: 6,
			regelmäßig: 7,
			täglich_angewiesen: 8
		},
		zukunftsangst: {
			optimistisch: 4,
			neutral: 6,
			besorgt: 7,
			große_angst: 6
		}
	},

	CDU: {
		wohnen: { miete: 5, eigentum: 7 },
		einkommen: { niedrig: 3, mittel: 7, hoch: 8, sehr_hoch: 7 },
		lebenssituation: {
			erwerbstaetig: 8,
			selbstständig: 8,
			studierend_auszubildend: 5,
			arbeitslos_uebergangsphase: 4
		},
		familie: { kinderlos: 5, elternteil: 8, alleinerziehend: 5 },
		urbanisierung: { grossstadt: 6, laendlich: 7 },
		klima: { egal: 5, passiv: 7, mittel: 7, aktiv: 5 },
		gesundheitskosten: {
			keine_belastung: 7,
			gering: 7,
			mittel: 6,
			hoch: 5,
			sehr_hoch: 4
		},
		arbeitssicherheit: {
			sicher: 8,
			unsicher: 5,
			befristet_prekär: 4,
			existenzangst: 3
		},
		bildungszugang: {
			sehr_gut: 8,
			gut: 7,
			eingeschränkt: 5,
			schlecht: 4
		},
		pflege: {
			nicht_betroffen: 6,
			zukunft: 6,
			aktuell_familienmitglied: 6,
			selbst_pflegebedürftig: 5
		},
		digitalisierung: {
			unwichtig: 5,
			etwas_wichtig: 6,
			wichtig: 7,
			sehr_wichtig: 7
		},
		oeffentlicher_verkehr: {
			nicht_nötig: 7,
			gelegentlich: 6,
			regelmäßig: 5,
			täglich_angewiesen: 4
		},
		zukunftsangst: {
			optimistisch: 7,
			neutral: 7,
			besorgt: 5,
			große_angst: 3
		}
	},

	'Die Linke': {
		wohnen: { miete: 10, eigentum: 3 },
		einkommen: { niedrig: 10, mittel: 9, hoch: 2, sehr_hoch: 1 },
		lebenssituation: {
			erwerbstaetig: 6,
			selbstständig: 4,
			studierend_auszubildend: 8,
			arbeitslos_uebergangsphase: 10
		},
		familie: { kinderlos: 7, elternteil: 8, alleinerziehend: 10 },
		urbanisierung: { grossstadt: 8, laendlich: 5 },
		klima: { egal: 3, passiv: 4, mittel: 7, aktiv: 9 },
		gesundheitskosten: {
			keine_belastung: 3,
			gering: 5,
			mittel: 8,
			hoch: 10,
			sehr_hoch: 10
		},
		arbeitssicherheit: {
			sicher: 7,
			unsicher: 9,
			befristet_prekär: 10,
			existenzangst: 10
		},
		bildungszugang: {
			sehr_gut: 6,
			gut: 7,
			eingeschränkt: 9,
			schlecht: 10
		},
		pflege: {
			nicht_betroffen: 5,
			zukunft: 7,
			aktuell_familienmitglied: 9,
			selbst_pflegebedürftig: 10
		},
		digitalisierung: {
			unwichtig: 4,
			etwas_wichtig: 6,
			wichtig: 8,
			sehr_wichtig: 9
		},
		oeffentlicher_verkehr: {
			nicht_nötig: 3,
			gelegentlich: 6,
			regelmäßig: 9,
			täglich_angewiesen: 10
		},
		zukunftsangst: {
			optimistisch: 5,
			neutral: 6,
			besorgt: 8,
			große_angst: 9
		}
	},

	FDP: {
		wohnen: { miete: 2, eigentum: 10 },
		einkommen: { niedrig: 2, mittel: 5, hoch: 10, sehr_hoch: 10 },
		lebenssituation: {
			erwerbstaetig: 8,
			selbstständig: 10,
			studierend_auszubildend: 6,
			arbeitslos_uebergangsphase: 2
		},
		familie: { kinderlos: 7, elternteil: 5, alleinerziehend: 2 },
		urbanisierung: { grossstadt: 7, laendlich: 5 },
		klima: { egal: 5, passiv: 6, mittel: 7, aktiv: 5 },
		gesundheitskosten: {
			keine_belastung: 9,
			gering: 7,
			mittel: 5,
			hoch: 3,
			sehr_hoch: 2
		},
		arbeitssicherheit: {
			sicher: 8,
			unsicher: 5,
			befristet_prekär: 3,
			existenzangst: 2
		},
		bildungszugang: {
			sehr_gut: 9,
			gut: 7,
			eingeschränkt: 4,
			schlecht: 3
		},
		pflege: {
			nicht_betroffen: 7,
			zukunft: 5,
			aktuell_familienmitglied: 4,
			selbst_pflegebedürftig: 3
		},
		digitalisierung: {
			unwichtig: 3,
			etwas_wichtig: 6,
			wichtig: 9,
			sehr_wichtig: 10
		},
		oeffentlicher_verkehr: {
			nicht_nötig: 8,
			gelegentlich: 6,
			regelmäßig: 4,
			täglich_angewiesen: 3
		},
		zukunftsangst: {
			optimistisch: 9,
			neutral: 7,
			besorgt: 4,
			große_angst: 2
		}
	},

	'Die Grünen': {
		wohnen: { miete: 9, eigentum: 4 },
		einkommen: { niedrig: 6, mittel: 7, hoch: 6, sehr_hoch: 5 },
		lebenssituation: {
			erwerbstaetig: 7,
			selbstständig: 6,
			studierend_auszubildend: 9,
			arbeitslos_uebergangsphase: 7
		},
		familie: { kinderlos: 7, elternteil: 7, alleinerziehend: 8 },
		urbanisierung: { grossstadt: 10, laendlich: 4 },
		klima: { egal: 1, passiv: 3, mittel: 7, aktiv: 10 },
		gesundheitskosten: {
			keine_belastung: 5,
			gering: 6,
			mittel: 7,
			hoch: 8,
			sehr_hoch: 8
		},
		arbeitssicherheit: {
			sicher: 7,
			unsicher: 7,
			befristet_prekär: 8,
			existenzangst: 7
		},
		bildungszugang: {
			sehr_gut: 8,
			gut: 8,
			eingeschränkt: 8,
			schlecht: 9
		},
		pflege: {
			nicht_betroffen: 6,
			zukunft: 7,
			aktuell_familienmitglied: 8,
			selbst_pflegebedürftig: 8
		},
		digitalisierung: {
			unwichtig: 3,
			etwas_wichtig: 6,
			wichtig: 8,
			sehr_wichtig: 9
		},
		oeffentlicher_verkehr: {
			nicht_nötig: 2,
			gelegentlich: 5,
			regelmäßig: 9,
			täglich_angewiesen: 10
		},
		zukunftsangst: {
			optimistisch: 6,
			neutral: 7,
			besorgt: 8,
			große_angst: 7
		}
	},

	SPD: {
		wohnen: { miete: 8, eigentum: 5 },
		einkommen: { niedrig: 9, mittel: 8, hoch: 4, sehr_hoch: 2 },
		lebenssituation: {
			erwerbstaetig: 8,
			selbstständig: 6,
			studierend_auszubildend: 7,
			arbeitslos_uebergangsphase: 9
		},
		familie: { kinderlos: 7, elternteil: 8, alleinerziehend: 9 },
		urbanisierung: { grossstadt: 8, laendlich: 7 },
		klima: { egal: 4, passiv: 5, mittel: 7, aktiv: 8 },
		gesundheitskosten: {
			keine_belastung: 5,
			gering: 6,
			mittel: 8,
			hoch: 9,
			sehr_hoch: 9
		},
		arbeitssicherheit: {
			sicher: 8,
			unsicher: 8,
			befristet_prekär: 9,
			existenzangst: 9
		},
		bildungszugang: {
			sehr_gut: 7,
			gut: 8,
			eingeschränkt: 9,
			schlecht: 9
		},
		pflege: {
			nicht_betroffen: 6,
			zukunft: 7,
			aktuell_familienmitglied: 9,
			selbst_pflegebedürftig: 9
		},
		digitalisierung: {
			unwichtig: 4,
			etwas_wichtig: 6,
			wichtig: 8,
			sehr_wichtig: 8
		},
		oeffentlicher_verkehr: {
			nicht_nötig: 5,
			gelegentlich: 7,
			regelmäßig: 8,
			täglich_angewiesen: 9
		},
		zukunftsangst: {
			optimistisch: 7,
			neutral: 7,
			besorgt: 7,
			große_angst: 6
		}
	}
};
