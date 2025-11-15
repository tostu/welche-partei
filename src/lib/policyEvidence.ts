import type { Category } from './categories';

export type Party = 'CDU' | 'SPD' | 'Grüne' | 'FDP' | 'Die Linke' | 'AfD' | 'BSW';

export interface Promise {
	party: Party;
	promise: string;
	result: string;
	status: 'exceeded' | 'partial' | 'delayed' | 'broken';
	importance: 'high' | 'medium' | 'low';
}

export interface OppositionProposal {
	party: Party;
	proposal: string;
	voterSupport: number;
	canImplement: false;
}

export interface PositionConsistency {
	party: Party;
	originalPosition: string; // Position im Wahlprogramm 2021
	currentPosition: string; // Aktuelle Position 2024/2025
	status: 'maintained' | 'strengthened' | 'weakened' | 'abandoned';
	importance: 'high' | 'medium' | 'low';
}

export interface ActualData {
	metric: string;
	promised?: string;
	actual: string;
	change?: string;
	source: string;
}

export interface CategoryEvidence {
	category: Category;
	displayName: string;
	coalitionPromises: Promise[];
	oppositionProposals: OppositionProposal[];
	positionConsistency: PositionConsistency[]; // Neu: Für ALLE Parteien
	actualData: ActualData[];
}

// Evidence data mapped to quiz categories
export const policyEvidence: CategoryEvidence[] = [
	{
		category: 'taxes',
		displayName: 'Steuern',
		coalitionPromises: [
			{
				party: 'SPD',
				promise: 'Keine Steuererhöhungen für 95% der Bürger',
				result: 'Kalte Progression erhöht faktische Steuerlast durch Inflation',
				status: 'broken',
				importance: 'high'
			},
			{
				party: 'CDU',
				promise: 'Entlastung für mittlere Einkommen',
				result: 'Inflationsausgleich verzögert, reale Kaufkraft gesunken',
				status: 'delayed',
				importance: 'high'
			},
			{
				party: 'SPD',
				promise: 'Vermögensteuer für Superreiche',
				result: 'Nicht umgesetzt, CDU blockiert im Koalitionsvertrag',
				status: 'broken',
				importance: 'medium'
			}
		],
		oppositionProposals: [
			{
				party: 'Grüne',
				proposal: 'Vermögensteuer ab 2 Mio. Euro',
				voterSupport: 68,
				canImplement: false
			},
			{
				party: 'Die Linke',
				proposal: 'Millionärssteuer: 75% ab 1 Mio. Euro',
				voterSupport: 45,
				canImplement: false
			}
		],
		positionConsistency: [
			{
				party: 'Grüne',
				originalPosition: 'Vermögensteuer ab 2 Mio. Euro (Wahlprogramm 2021)',
				currentPosition: 'Fordern weiterhin Vermögensteuer (Position 2025)',
				status: 'maintained',
				importance: 'high'
			},
			{
				party: 'Die Linke',
				originalPosition: 'Millionärssteuer 75% ab 1 Mio. Euro (2021)',
				currentPosition: 'Position unverändert beibehalten (2025)',
				status: 'maintained',
				importance: 'high'
			},
			{
				party: 'FDP',
				originalPosition: 'Steuersenkungen für alle (2021)',
				currentPosition: 'Steuersenkungen weiterhin Kernforderung (2025)',
				status: 'maintained',
				importance: 'high'
			},
			{
				party: 'AfD',
				originalPosition: 'Einkommensteuer senken, Vermögensteuer ablehnen (2021)',
				currentPosition: 'Position beibehalten (2025)',
				status: 'maintained',
				importance: 'medium'
			},
			{
				party: 'SPD',
				originalPosition: 'Vermögensteuer einführen (Wahlprogramm 2021)',
				currentPosition: 'Nicht mehr Teil des Koalitionsvertrags (2025)',
				status: 'abandoned',
				importance: 'high'
			},
			{
				party: 'CDU',
				originalPosition: 'Keine neuen Steuern (2021)',
				currentPosition: 'Position beibehalten (2025)',
				status: 'maintained',
				importance: 'medium'
			}
		],
		actualData: [
			{
				metric: 'Durchschnittliche Steuerlast Mittelschicht',
				promised: '38%',
				actual: '41%',
				change: '+3 Prozentpunkte',
				source: 'Bundesfinanzministerium 2024'
			},
			{
				metric: 'Vermögensteuer-Einnahmen',
				promised: '10 Mrd. Euro/Jahr',
				actual: '0 Euro',
				change: '-100%',
				source: 'Koalitionsvertrag vs. Haushaltsplan'
			}
		]
	},
	{
		category: 'climate',
		displayName: 'Klimaschutz',
		coalitionPromises: [
			{
				party: 'CDU',
				promise: '65% CO2-Reduktion bis 2030',
				result: 'Aktueller Pfad: nur 55% erreichbar',
				status: 'delayed',
				importance: 'high'
			},
			{
				party: 'SPD',
				promise: '80% erneuerbare Energien bis 2030',
				result: 'Aktuell bei 52%, Ausbau zu langsam',
				status: 'delayed',
				importance: 'high'
			},
			{
				party: 'CDU',
				promise: 'Kohleausstieg bis 2038',
				result: 'Weiterhin auf Kurs, aber keine Beschleunigung',
				status: 'partial',
				importance: 'medium'
			}
		],
		oppositionProposals: [
			{
				party: 'Grüne',
				proposal: 'Kohleausstieg bis 2030',
				voterSupport: 61,
				canImplement: false
			},
			{
				party: 'Die Linke',
				proposal: 'Klimageld 200€/Person/Jahr sofort',
				voterSupport: 72,
				canImplement: false
			}
		],
		positionConsistency: [],
		actualData: [
			{
				metric: 'CO2-Emissionen',
				promised: '-65% bis 2030',
				actual: '-46% aktuell',
				change: '19 Prozentpunkte hinter Plan',
				source: 'Umweltbundesamt 2024'
			},
			{
				metric: 'Erneuerbare Energien Anteil',
				promised: '80% bis 2030',
				actual: '52%',
				change: 'Jährlicher Zubau zu langsam',
				source: 'Bundesnetzagentur 2024'
			}
		]
	},
	{
		category: 'migration',
		displayName: 'Migration',
		coalitionPromises: [
			{
				party: 'CDU',
				promise: 'Obergrenze 200.000 Flüchtlinge/Jahr',
				result: '2023: 334.000 Asylanträge',
				status: 'broken',
				importance: 'high'
			},
			{
				party: 'SPD',
				promise: 'Faire Verteilung in EU durchsetzen',
				result: 'Weiterhin Hauptlast bei Deutschland',
				status: 'broken',
				importance: 'high'
			},
			{
				party: 'CDU',
				promise: 'Schnellere Abschiebungen',
				result: 'Abschiebequote von 22% auf 18% gesunken',
				status: 'broken',
				importance: 'medium'
			}
		],
		oppositionProposals: [
			{
				party: 'AfD',
				proposal: 'Grenzen schließen, Massenabschiebungen',
				voterSupport: 23,
				canImplement: false
			},
			{
				party: 'Grüne',
				proposal: 'Legale Fluchtwege schaffen',
				voterSupport: 38,
				canImplement: false
			}
		],
		positionConsistency: [],
		actualData: [
			{
				metric: 'Asylanträge 2023',
				promised: 'max. 200.000',
				actual: '334.000',
				change: '+67%',
				source: 'BAMF 2024'
			},
			{
				metric: 'Abschiebequote',
				promised: 'Erhöhung',
				actual: '18%',
				change: '-4 Prozentpunkte seit 2021',
				source: 'Bundesinnenministerium'
			}
		]
	},
	{
		category: 'housing',
		displayName: 'Wohnen',
		coalitionPromises: [
			{
				party: 'SPD',
				promise: '400.000 neue Wohnungen pro Jahr',
				result: '2023: nur 295.000 fertiggestellt',
				status: 'broken',
				importance: 'high'
			},
			{
				party: 'SPD',
				promise: 'Mietendeckel bundesweit prüfen',
				result: 'Nicht umgesetzt, CDU blockiert',
				status: 'broken',
				importance: 'high'
			},
			{
				party: 'CDU',
				promise: 'Baukostensenkung durch Bürokratieabbau',
				result: 'Baukosten +12% gestiegen',
				status: 'broken',
				importance: 'medium'
			}
		],
		oppositionProposals: [
			{
				party: 'Die Linke',
				proposal: 'Bundesweiter Mietendeckel',
				voterSupport: 64,
				canImplement: false
			},
			{
				party: 'Grüne',
				proposal: 'Bodenpreise deckeln',
				voterSupport: 52,
				canImplement: false
			}
		],
		positionConsistency: [],
		actualData: [
			{
				metric: 'Fertiggestellte Wohnungen 2023',
				promised: '400.000',
				actual: '295.000',
				change: '-26%',
				source: 'Destatis 2024'
			},
			{
				metric: 'Durchschnittliche Miete',
				promised: 'Stabilisierung',
				actual: '+18% seit 2021',
				change: 'Stärkster Anstieg seit 2000',
				source: 'Immobilienverband Deutschland'
			}
		]
	},
	{
		category: 'healthcare',
		displayName: 'Gesundheit',
		coalitionPromises: [
			{
				party: 'SPD',
				promise: 'Bürgerversicherung einführen',
				result: 'Nicht umgesetzt, CDU blockiert',
				status: 'broken',
				importance: 'high'
			},
			{
				party: 'CDU',
				promise: 'Flächendeckende Notfallversorgung sichern',
				result: '400 Kliniken von Schließung bedroht',
				status: 'broken',
				importance: 'high'
			},
			{
				party: 'SPD',
				promise: 'Pflegekräfte besser bezahlen',
				result: 'Tarifsteigerungen nur +8% bei 15% Inflation',
				status: 'partial',
				importance: 'medium'
			}
		],
		oppositionProposals: [
			{
				party: 'Die Linke',
				proposal: 'Gesundheitssystem vollständig verstaatlichen',
				voterSupport: 41,
				canImplement: false
			},
			{
				party: 'Grüne',
				proposal: 'Bürgerversicherung ohne Ausnahmen',
				voterSupport: 58,
				canImplement: false
			}
		],
		positionConsistency: [],
		actualData: [
			{
				metric: 'Krankenhausschließungen',
				promised: 'Versorgung sichern',
				actual: '400 Kliniken gefährdet',
				change: '+120 seit 2021',
				source: 'Deutsche Krankenhausgesellschaft'
			},
			{
				metric: 'Pflegekräftemangel',
				promised: 'Abbauen',
				actual: '200.000 fehlende Stellen',
				change: '+50.000 seit 2021',
				source: 'Bundesgesundheitsministerium'
			}
		]
	},
	{
		category: 'education',
		displayName: 'Bildung',
		coalitionPromises: [
			{
				party: 'SPD',
				promise: 'Digitalpakt verlängern mit 10 Mrd. Euro',
				result: 'Nur 5 Mrd. zugesagt, Länder blockieren',
				status: 'partial',
				importance: 'high'
			},
			{
				party: 'CDU',
				promise: 'Lehrkräftemangel beheben',
				result: 'Mangel von 30.000 auf 40.000 gestiegen',
				status: 'broken',
				importance: 'high'
			},
			{
				party: 'SPD',
				promise: 'BAföG deutlich erhöhen',
				result: '+5% bei 15% Inflation = realer Verlust',
				status: 'broken',
				importance: 'medium'
			}
		],
		oppositionProposals: [
			{
				party: 'Grüne',
				proposal: 'Bundesweite Schulstandards durchsetzen',
				voterSupport: 67,
				canImplement: false
			},
			{
				party: 'Die Linke',
				proposal: 'Elternunabhängiges BAföG für alle',
				voterSupport: 71,
				canImplement: false
			}
		],
		positionConsistency: [],
		actualData: [
			{
				metric: 'Lehrkräftemangel',
				promised: 'Beheben',
				actual: '40.000 fehlende Lehrer',
				change: '+10.000 seit 2021',
				source: 'Kultusministerkonferenz 2024'
			},
			{
				metric: 'BAföG-Empfänger',
				promised: 'Mehr Studenten erreichen',
				actual: '-8% seit 2021',
				change: 'Niedrigster Stand seit 2007',
				source: 'Destatis Bildungsfinanzbericht'
			}
		]
	},
	{
		category: 'defense',
		displayName: 'Verteidigung',
		coalitionPromises: [
			{
				party: 'CDU',
				promise: '2% BIP für Verteidigung ab 2024',
				result: '100 Mrd. Sondervermögen, aber nur 1.7% regulär',
				status: 'partial',
				importance: 'high'
			},
			{
				party: 'SPD',
				promise: 'Bundeswehr modernisieren',
				result: 'Beschaffung verzögert, Material veraltet',
				status: 'delayed',
				importance: 'high'
			},
			{
				party: 'CDU',
				promise: 'Einsatzbereitschaft erhöhen',
				result: 'Nur 30% des Geräts voll einsatzbereit',
				status: 'broken',
				importance: 'medium'
			}
		],
		oppositionProposals: [
			{
				party: 'Die Linke',
				proposal: 'Verteidigungsausgaben halbieren',
				voterSupport: 18,
				canImplement: false
			},
			{
				party: 'Grüne',
				proposal: 'Waffenexporte stoppen',
				voterSupport: 42,
				canImplement: false
			}
		],
		positionConsistency: [],
		actualData: [
			{
				metric: 'Verteidigungsausgaben (% BIP)',
				promised: '2%',
				actual: '1.7% (ohne Sondervermögen)',
				change: 'Ziel verfehlt',
				source: 'Bundeshaushalt 2024'
			},
			{
				metric: 'Materialeinsatzbereitschaft',
				promised: '70%',
				actual: '30%',
				change: 'Keine Verbesserung',
				source: 'Bundeswehr Jahresbericht 2023'
			}
		]
	},
	{
		category: 'economy',
		displayName: 'Wirtschaft',
		coalitionPromises: [
			{
				party: 'CDU',
				promise: 'Wirtschaftswachstum 2% pro Jahr',
				result: '2023: -0.3% Rezession',
				status: 'broken',
				importance: 'high'
			},
			{
				party: 'SPD',
				promise: 'Mindestlohn auf 15 Euro',
				result: 'Nur 12.41 Euro erreicht',
				status: 'partial',
				importance: 'high'
			},
			{
				party: 'CDU',
				promise: 'Bürokratie abbauen',
				result: '+15.000 neue Vorschriften seit 2021',
				status: 'broken',
				importance: 'medium'
			}
		],
		oppositionProposals: [
			{
				party: 'FDP',
				proposal: 'Steuerlast massiv senken',
				voterSupport: 54,
				canImplement: false
			},
			{
				party: 'Die Linke',
				proposal: 'Mindestlohn 14 Euro sofort',
				voterSupport: 68,
				canImplement: false
			}
		],
		positionConsistency: [],
		actualData: [
			{
				metric: 'BIP-Wachstum 2023',
				promised: '+2%',
				actual: '-0.3%',
				change: 'Erste Rezession seit 2020',
				source: 'Destatis VGR 2024'
			},
			{
				metric: 'Mindestlohn',
				promised: '15 Euro',
				actual: '12.41 Euro',
				change: '-17% unter Versprechen',
				source: 'Mindestlohnkommission'
			}
		]
	},
	{
		category: 'socialsecurity',
		displayName: 'Soziale Sicherheit',
		coalitionPromises: [
			{
				party: 'SPD',
				promise: 'Grundrente ohne Bedürftigkeitsprüfung',
				result: 'Komplexe Prüfung eingeführt, nur 30% erhalten',
				status: 'broken',
				importance: 'high'
			},
			{
				party: 'CDU',
				promise: 'Rentenniveau bei 48% stabil halten',
				result: 'Aktuell 48.1%, aber ab 2025 Senkung geplant',
				status: 'partial',
				importance: 'high'
			},
			{
				party: 'SPD',
				promise: 'Bürgergeld ohne Sanktionen',
				result: 'Sanktionen beibehalten, verschärft 2024',
				status: 'broken',
				importance: 'medium'
			}
		],
		oppositionProposals: [
			{
				party: 'Die Linke',
				proposal: 'Mindestrente 1.200 Euro für alle',
				voterSupport: 74,
				canImplement: false
			},
			{
				party: 'Grüne',
				proposal: 'Kindergrundsicherung 500 Euro/Kind',
				voterSupport: 58,
				canImplement: false
			}
		],
		positionConsistency: [],
		actualData: [
			{
				metric: 'Grundrenten-Empfänger',
				promised: '1.3 Mio.',
				actual: '400.000',
				change: '-70%',
				source: 'Deutsche Rentenversicherung'
			},
			{
				metric: 'Altersarmut',
				promised: 'Reduzieren',
				actual: '18% der Rentner unter Armutsgrenze',
				change: '+2 Prozentpunkte seit 2021',
				source: 'Paritätischer Wohlfahrtsverband'
			}
		]
	},
	{
		category: 'digitalization',
		displayName: 'Digitalisierung',
		coalitionPromises: [
			{
				party: 'CDU',
				promise: 'Flächendeckend Glasfaser bis 2025',
				result: 'Nur 68% erreicht, Ziel verfehlt',
				status: 'broken',
				importance: 'high'
			},
			{
				party: 'SPD',
				promise: 'Digitale Verwaltung: alle Dienste online',
				result: 'Nur 15% der Behördenleistungen digital',
				status: 'broken',
				importance: 'high'
			},
			{
				party: 'CDU',
				promise: '5G flächendeckend bis 2024',
				result: '89% abgedeckt, ländliche Räume vernachlässigt',
				status: 'partial',
				importance: 'medium'
			}
		],
		oppositionProposals: [
			{
				party: 'FDP',
				proposal: 'Digitales Bildungssystem mit KI',
				voterSupport: 61,
				canImplement: false
			},
			{
				party: 'Grüne',
				proposal: 'Recht auf schnelles Internet gesetzlich',
				voterSupport: 78,
				canImplement: false
			}
		],
		positionConsistency: [],
		actualData: [
			{
				metric: 'Glasfaserabdeckung',
				promised: '100% bis 2025',
				actual: '68%',
				change: 'Ziel um 32 Prozentpunkte verfehlt',
				source: 'Bundesnetzagentur Breitbandatlas'
			},
			{
				metric: 'Digitale Behördenleistungen',
				promised: '100% online',
				actual: '15%',
				change: 'EU-Schlusslicht',
				source: 'Nationaler Normenkontrollrat 2024'
			}
		]
	},
	{
		category: 'infrastructure',
		displayName: 'Infrastruktur',
		coalitionPromises: [
			{
				party: 'CDU',
				promise: 'Modernisierung Schienennetz mit 100 Mrd.',
				result: 'Nur 40 Mrd. investiert, Verzögerungen',
				status: 'delayed',
				importance: 'high'
			},
			{
				party: 'SPD',
				promise: 'Keine Privatisierung der Autobahnen',
				result: 'Teilprivatisierungen über Autobahn GmbH',
				status: 'broken',
				importance: 'medium'
			},
			{
				party: 'CDU',
				promise: 'Brückensanierung beschleunigen',
				result: 'Sanierungsstau von 45 auf 52 Mrd. gestiegen',
				status: 'broken',
				importance: 'high'
			}
		],
		oppositionProposals: [
			{
				party: 'Grüne',
				proposal: 'Autobahnbau stoppen, Bahn massiv ausbauen',
				voterSupport: 48,
				canImplement: false
			},
			{
				party: 'Die Linke',
				proposal: 'ÖPNV kostenfrei für alle',
				voterSupport: 62,
				canImplement: false
			}
		],
		positionConsistency: [],
		actualData: [
			{
				metric: 'Sanierungsstau Infrastruktur',
				promised: 'Reduzieren',
				actual: '52 Mrd. Euro',
				change: '+7 Mrd. seit 2021',
				source: 'KfW Kommunalpanel 2024'
			},
			{
				metric: 'Pünktlichkeit Fernverkehr',
				promised: '80%',
				actual: '64%',
				change: '-3 Prozentpunkte seit 2021',
				source: 'Deutsche Bahn Statistik'
			}
		]
	},
	{
		category: 'foreignpolicy',
		displayName: 'Außenpolitik',
		coalitionPromises: [
			{
				party: 'SPD',
				promise: 'Keine Waffenlieferungen in Krisengebiete',
				result: 'Waffenexporte +30%, u.a. Saudi-Arabien',
				status: 'broken',
				importance: 'high'
			},
			{
				party: 'CDU',
				promise: 'EU-Beitritt Ukraine unterstützen',
				result: 'Beitrittsverhandlungen begonnen',
				status: 'exceeded',
				importance: 'high'
			},
			{
				party: 'SPD',
				promise: 'Entwicklungshilfe auf 0.7% BIP erhöhen',
				result: 'Nur 0.46%, Kürzungen geplant',
				status: 'broken',
				importance: 'medium'
			}
		],
		oppositionProposals: [
			{
				party: 'Die Linke',
				proposal: 'NATO verlassen',
				voterSupport: 15,
				canImplement: false
			},
			{
				party: 'AfD',
				proposal: 'EU-Austritt (DEXIT)',
				voterSupport: 12,
				canImplement: false
			}
		],
		positionConsistency: [],
		actualData: [
			{
				metric: 'Waffenexporte',
				promised: 'Reduzieren',
				actual: '12.2 Mrd. Euro (2023)',
				change: '+30% seit 2021',
				source: 'SIPRI Waffenexportbericht'
			},
			{
				metric: 'Entwicklungshilfe (% BIP)',
				promised: '0.7%',
				actual: '0.46%',
				change: '-34% unter UN-Ziel',
				source: 'OECD Development Aid 2024'
			}
		]
	},
	{
		category: 'democracy',
		displayName: 'Demokratie',
		coalitionPromises: [
			{
				party: 'SPD',
				promise: 'Wahlrecht ab 16 bei Bundestagswahl',
				result: 'Nicht umgesetzt, CDU blockiert',
				status: 'broken',
				importance: 'medium'
			},
			{
				party: 'CDU',
				promise: 'Parteienfinanzierung transparenter machen',
				result: 'Minimalreform, Großspenden weiter intransparent',
				status: 'partial',
				importance: 'medium'
			},
			{
				party: 'SPD',
				promise: 'Lobbyregister mit Fußabdruck',
				result: 'Register ohne Fußabdruck eingeführt',
				status: 'partial',
				importance: 'low'
			}
		],
		oppositionProposals: [
			{
				party: 'Grüne',
				proposal: 'Volksentscheide auf Bundesebene',
				voterSupport: 82,
				canImplement: false
			},
			{
				party: 'Die Linke',
				proposal: 'Parteispenden komplett verbieten',
				voterSupport: 56,
				canImplement: false
			}
		],
		positionConsistency: [],
		actualData: [
			{
				metric: 'Wahlbeteiligung Junge (18-24)',
				promised: 'Erhöhen',
				actual: '68%',
				change: '-3 Prozentpunkte seit 2021',
				source: 'Bundeswahlleiter 2024'
			},
			{
				metric: 'Transparenz Parteispenden',
				promised: 'Vollständig',
				actual: 'Nur Spenden >50.000€ sofort gemeldet',
				change: 'Schlupflöcher bleiben',
				source: 'Bundestag Rechenschaftsbericht'
			}
		]
	}
];

// Helper function to calculate trust score for a party (only coalition parties)
export function calculateTrustScore(party: Party): {
	rate: number;
	total: number;
	exceeded: number;
	partial: number;
	delayed: number;
	broken: number;
} {
	let total = 0;
	let exceeded = 0;
	let partial = 0;
	let delayed = 0;
	let broken = 0;

	policyEvidence.forEach((evidence) => {
		evidence.coalitionPromises.forEach((promise) => {
			if (promise.party === party) {
				total++;
				if (promise.status === 'exceeded') exceeded++;
				else if (promise.status === 'partial') partial++;
				else if (promise.status === 'delayed') delayed++;
				else if (promise.status === 'broken') broken++;
			}
		});
	});

	// Calculate fulfillment rate (exceeded + partial as fulfilled)
	const fulfilled = exceeded + partial * 0.5;
	const rate = total > 0 ? (fulfilled / total) * 100 : 0;

	return { rate, total, exceeded, partial, delayed, broken };
}

// Helper function to calculate position consistency score for ANY party
export function calculateConsistencyScore(party: Party): {
	rate: number;
	total: number;
	maintained: number;
	strengthened: number;
	weakened: number;
	abandoned: number;
} {
	let total = 0;
	let maintained = 0;
	let strengthened = 0;
	let weakened = 0;
	let abandoned = 0;

	policyEvidence.forEach((evidence) => {
		if (evidence.positionConsistency) {
			evidence.positionConsistency.forEach((position) => {
				if (position.party === party) {
					total++;
					if (position.status === 'maintained') maintained++;
					else if (position.status === 'strengthened') strengthened++;
					else if (position.status === 'weakened') weakened++;
					else if (position.status === 'abandoned') abandoned++;
				}
			});
		}
	});

	// Calculate consistency rate (maintained + strengthened as consistent)
	const consistent = maintained + strengthened;
	const rate = total > 0 ? (consistent / total) * 100 : 0;

	return { rate, total, maintained, strengthened, weakened, abandoned };
}
