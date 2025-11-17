// Simplified data model for party scores to reduce maintenance.
// Instead of a large evidence array, scores are pre-calculated and stored here.
// To update a score, simply change the value in the corresponding object.

export type Party = 'CDU' | 'SPD' | 'Grüne' | 'FDP' | 'Die Linke' | 'AfD' | 'BSW';

type Score = {
	rate: number;
	total: number;
	[key: string]: number;
};

// Pre-calculated trust scores for coalition parties.
// 'rate' is the fulfillment rate: (exceeded + partial * 0.5) / total * 100
const trustScores: Record<Party, Score | null> = {
	CDU: { rate: 17, total: 18, exceeded: 1, partial: 4, delayed: 3, broken: 9 },
	SPD: { rate: 11, total: 19, exceeded: 0, partial: 4, delayed: 2, broken: 12 },
	Grüne: null,
	FDP: null,
	'Die Linke': null,
	AfD: null,
	BSW: null
};

// Pre-calculated position consistency scores for all parties.
// 'rate' is the consistency rate: (maintained + strengthened) / total * 100
const consistencyScores: Record<Party, Score> = {
	CDU: { rate: 100, total: 1, maintained: 1, strengthened: 0, weakened: 0, abandoned: 0 },
	SPD: { rate: 0, total: 1, maintained: 0, strengthened: 0, weakened: 0, abandoned: 1 },
	Grüne: { rate: 100, total: 1, maintained: 1, strengthened: 0, weakened: 0, abandoned: 0 },
	FDP: { rate: 100, total: 1, maintained: 1, strengthened: 0, weakened: 0, abandoned: 0 },
	'Die Linke': { rate: 100, total: 1, maintained: 1, strengthened: 0, weakened: 0, abandoned: 0 },
	AfD: { rate: 100, total: 1, maintained: 1, strengthened: 0, weakened: 0, abandoned: 0 },
	BSW: { rate: 100, total: 0, maintained: 0, strengthened: 0, weakened: 0, abandoned: 0 } // No data, assume 100% for now
};

/**
 * Looks up the pre-calculated trust score for a given party.
 * @param party The party to look up.
 * @returns The score object or a default object if not found.
 */
export function calculateTrustScore(party: Party): Score {
	return trustScores[party] ?? { rate: 0, total: 0, exceeded: 0, partial: 0, delayed: 0, broken: 0 };
}

/**
 * Looks up the pre-calculated consistency score for a given party.
 * @param party The party to look up.
 * @returns The score object or a default object if not found.
 */
export function calculateConsistencyScore(party: Party): Score {
	return consistencyScores[party] ?? { rate: 0, total: 0, maintained: 0, strengthened: 0, weakened: 0, abandoned: 0 };
}
