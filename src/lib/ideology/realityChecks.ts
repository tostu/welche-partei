import type { Party } from '$lib/parties';

export interface RealityCheckStatement {
	id: string;
	partyId: Party;
	label: string;
	text: string;
	partyStance: 'agree' | 'disagree';
	explanation: string;
	penalty: number; // Max percentage reduction if user holds opposite stance
}

export const realityChecks: RealityCheckStatement[] = [
	{
		id: 'afd-dexit',
		partyId: 'AFD',
		label: 'EU-Austritt (Dexit)',
		text: 'Deutschland sollte aus der Europäischen Union austreten (Dexit) und wieder eine nationale Währung einführen.',
		partyStance: 'agree',
		explanation:
			'Die AfD fordert den Austritt Deutschlands aus der EU oder deren Auflösung und steht der europäischen Integration grundsätzlich ablehnend gegenüber.',
		penalty: 15
	},
	{
		id: 'afd-klima',
		partyId: 'AFD',
		label: 'Klimaschutz beenden',
		text: 'Alle staatlichen Klimaschutz-Subventionen und CO2-Abgaben sollten sofort abgeschafft werden.',
		partyStance: 'agree',
		explanation:
			'Die AfD bestreitet den Einfluss des Menschen auf das Klima und fordert eine Beendigung aller Maßnahmen zur CO2-Minderung.',
		penalty: 15
	},
	{
		id: 'bsw-russland',
		partyId: 'BSW',
		label: 'Russland- & Ukrainepolitik',
		text: 'Deutschland sollte die Militärhilfe für die Ukraine stoppen und sich Russland annähern, um Frieden zu verhandeln.',
		partyStance: 'agree',
		explanation:
			'Das BSW lehnt Waffenlieferungen an die Ukraine strikt ab und fordert eine sofortige diplomatische Annäherung an Russland sowie ein Ende der Sanktionen.',
		penalty: 15
	},
	{
		id: 'bsw-migration',
		partyId: 'BSW',
		label: 'Begrenzung der Migration',
		text: 'Die Aufnahme von Asylbewerbern in Deutschland sollte stark begrenzt und Asylverfahren in Drittstaaten verlagert werden.',
		partyStance: 'agree',
		explanation:
			'Obwohl das BSW wirtschaftspolitisch links steht, vertritt es in der Migrationspolitik eine sehr restriktive Haltung.',
		penalty: 10
	},
	{
		id: 'cdu-atomkraft',
		partyId: 'CDU',
		label: 'Reaktivierung der Kernkraft',
		text: 'Deutschland sollte wieder in die Nutzung der Kernenergie einsteigen und neue Reaktoren bauen.',
		partyStance: 'agree',
		explanation:
			'Die Union plädiert für den Wiedereinstieg in die Kernkraft als CO2-freie Brückentechnologie und kritisiert den vollzogenen Atomausstieg.',
		penalty: 10
	},
	{
		id: 'cdu-asyl',
		partyId: 'CDU',
		label: 'Verschärfung des Asylrechts',
		text: 'Geflüchtete sollten an den deutschen Grenzen zurückgewiesen und Asylverfahren in sichere Drittstaaten ausgelagert werden.',
		partyStance: 'agree',
		explanation:
			'Die CDU fordert eine grundlegende Reform des Asylsystems hin zu Kontrollen an den Binnengrenzen und Drittstaatenlösungen.',
		penalty: 10
	},
	{
		id: 'linke-nato',
		partyId: 'Die Linke',
		label: 'Auflösung der NATO',
		text: 'Die NATO sollte aufgelöst und durch ein kollektives Sicherheitsbündnis unter Einbindung Russlands ersetzt werden.',
		partyStance: 'agree',
		explanation:
			'Die Linke lehnt Auslandseinsätze der Bundeswehr ab und fordert traditionell die Auflösung der NATO zugunsten eines neuen Sicherheitsbündnisses.',
		penalty: 15
	},
	{
		id: 'linke-steuern',
		partyId: 'Die Linke',
		label: 'Vermögenssteuer von 75%',
		text: 'Auf sehr hohe Vermögen und Spitzeneinkommen sollte eine Steuer von bis zu 75% erhoben werden.',
		partyStance: 'agree',
		explanation:
			'Die Linke fordert eine starke Besteuerung hoher Vermögen und Erbschaften zur Umverteilung und Staatsfinanzierung.',
		penalty: 10
	},
	{
		id: 'gruene-tempolimit',
		partyId: 'Die Grünen',
		label: 'Tempolimit 130 km/h',
		text: 'Auf deutschen Autobahnen sollte ein generelles Tempolimit von 130 km/h eingeführt werden.',
		partyStance: 'agree',
		explanation:
			'Die Grünen fordern das Tempolimit aus Gründen des Klimaschutzes, des Lärmschutzes und der Verkehrssicherheit.',
		penalty: 10
	},
	{
		id: 'gruene-verbrenner',
		partyId: 'Die Grünen',
		label: 'Verbrenner-Aus ab 2035',
		text: 'Der Verkauf neuer Autos mit Verbrennungsmotoren sollte ab 2035 vollständig verboten sein.',
		partyStance: 'agree',
		explanation:
			'Die Grünen unterstützen das EU-weite Aus für neue Verbrennungsmotoren ab 2035 und fordern eine schnellere Verkehrswende.',
		penalty: 10
	},
	{
		id: 'spd-mindestlohn',
		partyId: 'SPD',
		label: 'Mindestlohn auf 15€',
		text: 'Der gesetzliche Mindestlohn in Deutschland sollte zeitnah auf mindestens 15 Euro pro Stunde erhöht werden.',
		partyStance: 'agree',
		explanation:
			'Die SPD fordert eine deutliche Erhöhung des Mindestlohns auf 15 Euro, um Arbeitnehmer vor Kaufkraftverlusten zu schützen.',
		penalty: 10
	},
	{
		id: 'spd-rente',
		partyId: 'SPD',
		label: 'Keine Anhebung des Rentenalters',
		text: 'Das gesetzliche Renteneintrittsalter darf nicht über 67 Jahre hinaus angehoben werden.',
		partyStance: 'agree',
		explanation:
			'Die SPD schließt eine weitere Anhebung des Rentenalters aus und will das Rentenniveau stabilisieren.',
		penalty: 10
	},
	{
		id: 'fdp-schuldenbremse',
		partyId: 'FDP',
		label: 'Festhalten an der Schuldenbremse',
		text: 'Die im Grundgesetz verankerte Schuldenbremse muss ohne Ausnahmen eingehalten werden.',
		partyStance: 'agree',
		explanation:
			'Die FDP lehnt neue Staatsschulden und eine Lockerung der Schuldenbremse ab, um Generationengerechtigkeit zu wahren.',
		penalty: 10
	},
	{
		id: 'fdp-steuersenkung',
		partyId: 'FDP',
		label: 'Steuersenkungen für Spitzenverdiener',
		text: 'Die Steuern für Unternehmen und Bezieher hoher Einkommen sollten gesenkt werden, um Investitionen anzukurbeln.',
		partyStance: 'agree',
		explanation:
			'Die FDP setzt auf steuerliche Entlastungen der Wirtschaft und Leistungsträger als Wachstumsmotor.',
		penalty: 10
	},
	{
		id: 'volt-europa',
		partyId: 'Volt',
		label: 'Föderales Europa',
		text: 'Die Europäische Union sollte sich zu einem echten, föderalen europäischen Bundesstaat entwickeln.',
		partyStance: 'agree',
		explanation: 'Volt fordert einen demokratischen, föderalen europäischen Staat mit einer echten europäischen Regierung und gewählter EU-Präsidentschaft.',
		penalty: 10
	},
	{
		id: 'volt-klima',
		partyId: 'Volt',
		label: 'Klimaneutralität 2040',
		text: 'Deutschland sollte bis spätestens 2040 (statt 2045) die Netto-Klimaneutralität erreichen.',
		partyStance: 'agree',
		explanation: 'Volt Deutschland fordert ambitionierte Klimaschutzmaßnahmen mit dem Ziel, Europa und Deutschland bis spätestens 2040 vollständig klimaneutral zu machen.',
		penalty: 10
	},
	{
		id: 'fw-bargeld',
		partyId: 'Freie Wähler',
		label: 'Bargelderhalt',
		text: 'Die uneingeschränkte Nutzung und Akzeptanz von Bargeld muss gesetzlich oder in der Verfassung garantiert werden.',
		partyStance: 'agree',
		explanation: 'Die Freien Wähler lehnen jegliche Einschränkung von Bargeld ab und wollen es als Schutz der persönlichen Freiheit bewahren.',
		penalty: 10
	},
	{
		id: 'fw-demokratie',
		partyId: 'Freie Wähler',
		label: 'Direkte Demokratie',
		text: 'Auf Bundesebene sollten direktdemokratische Bürgerentscheide nach Schweizer Vorbild eingeführt werden.',
		partyStance: 'agree',
		explanation: 'Die Freien Wähler setzen stark auf Bürgerbeteiligung und fordern mehr direktdemokratische Elemente auch auf Bundesebene.',
		penalty: 10
	},
	{
		id: 'tierschutz-massentierhaltung',
		partyId: 'Tierschutzpartei',
		label: 'Massentierhaltungs-Verbot',
		text: 'Die industrielle Massentierhaltung in Deutschland sollte gesetzlich verboten werden.',
		partyStance: 'agree',
		explanation: 'Die Tierschutzpartei fordert eine Agrarwende hin zur pflanzlichen Erzeugung und die Abschaffung der Massentierhaltung.',
		penalty: 10
	},
	{
		id: 'tierschutz-tierversuche',
		partyId: 'Tierschutzpartei',
		label: 'Tierversuchsverbot',
		text: 'Tierversuche sollten ausnahmslos verboten und durch tierfreie Forschungsmethoden ersetzt werden.',
		partyStance: 'agree',
		explanation: 'Die Partei fordert den sofortigen Ausstieg aus Tierversuchen und staatliche Förderung alternativer Forschungsmethoden.',
		penalty: 10
	},
	{
		id: 'oedp-spenden',
		partyId: 'ÖDP',
		label: 'Firmenkredit/Konzernspenden-Verbot',
		text: 'Spenden von Unternehmen und Verbänden an politische Parteien sollten verboten werden.',
		partyStance: 'agree',
		explanation: 'Die ÖDP nimmt als einzige deutsche Partei prinzipiell keine Firmenspenden an und will diese verfassungsrechtlich verbieten, um Lobbyismus zu verhindern.',
		penalty: 10
	},
	{
		id: 'oedp-erziehungsgehalt',
		partyId: 'ÖDP',
		label: 'Erziehungsgehalt',
		text: 'Eltern, die ihre Kinder selbst betreuen, sollten dafür ein staatliches Gehalt (Erziehungsgehalt) erhalten.',
		partyStance: 'agree',
		explanation: 'Die ÖDP fordert finanzielle Anerkennung von Sorgearbeit durch ein staatliches Gehalt für erziehende Elternteile.',
		penalty: 10
	},
	{
		id: 'piraten-bge',
		partyId: 'Piratenpartei',
		label: 'Grundeinkommen',
		text: 'In Deutschland sollte ein bedingungsloses Grundeinkommen (BGE) für alle Bürger eingeführt werden.',
		partyStance: 'agree',
		explanation: 'Die Piratenpartei befürwortet die Einführung eines bedingungslosen Grundeinkommens zur sozialen Absicherung im digitalen Zeitalter.',
		penalty: 10
	},
	{
		id: 'piraten-ueberwachung',
		partyId: 'Piratenpartei',
		label: 'Massenüberwachungs-Stopp',
		text: 'Die automatische Gesichtserkennung und Massenüberwachung im öffentlichen Raum sollte gesetzlich verboten werden.',
		partyStance: 'agree',
		explanation: 'Die Piratenpartei kämpft für Bürgerrechte und den Schutz der Privatsphäre und lehnt biometrische Massenüberwachung strikt ab.',
		penalty: 10
	}
];

/**
 * Calculates the total penalty for a specific party based on the user's answers to the reality checks.
 *
 * @param partyId - The party ID to check
 * @param answers - Map of statement ID to user's answer ('agree' | 'neutral' | 'disagree')
 * @returns Total penalty percentage to subtract from the match percentage
 */
export function calculatePartyPenalty(
	partyId: Party,
	answers: Record<string, 'agree' | 'neutral' | 'disagree'>
): number {
	let totalPenalty = 0;
	const partyStatements = realityChecks.filter((s) => s.partyId === partyId);

	for (const statement of partyStatements) {
		const answer = answers[statement.id];
		if (!answer) continue;

		if (answer === 'neutral') {
			totalPenalty += statement.penalty / 2;
		} else if (answer !== statement.partyStance) {
			totalPenalty += statement.penalty;
		}
	}

	return totalPenalty;
}

/**
 * Gets reality check statements for specific parties.
 * Preserves the order of partyIds passed in.
 *
 * @param partyIds - List of party IDs to get statements for
 * @returns Filtered array of reality check statements
 */
export function getHaertetestStatements(partyIds: Party[]): RealityCheckStatement[] {
	const result: RealityCheckStatement[] = [];
	partyIds.forEach((partyId) => {
		const partyStatements = realityChecks.filter((s) => s.partyId === partyId);
		result.push(...partyStatements);
	});
	return result;
}

/**
 * Gets a specific statement for a party in a tournament round.
 * Round 'semi' returns the first statement, round 'final' returns the second.
 *
 * @param partyId - The party ID
 * @param round - 'semi' or 'final'
 * @returns The statement or null if not found
 */
export function getTournamentStatement(
	partyId: Party,
	round: 'semi' | 'final'
): RealityCheckStatement | null {
	const partyStatements = realityChecks.filter((s) => s.partyId === partyId);
	if (partyStatements.length === 0) return null;

	if (round === 'semi') {
		return partyStatements[0];
	} else {
		// Try to get second statement for final, fallback to first if only one exists
		return partyStatements[1] || partyStatements[0];
	}
}

