import type { UserIdeologicalProfile, PartyIdeologicalProfile } from './types';
import type { Party } from '$lib/parties';
import { partyIdeologies } from './partyIdeologies';

/**
 * Calculate Euclidean Distance
 *
 * Computes the Euclidean distance between a user's ideological scores and a party's scores.
 * The distance is calculated as: sqrt(sum((userScore[axis] - partyScore[axis])^2))
 *
 * A smaller distance indicates a closer ideological match.
 *
 * @param userScores - User's axis scores (e.g., { 'market-state': 6.5, 'individual-collective': 4.2 })
 * @param partyScores - Party's axis scores (e.g., { 'market-state': 7, 'individual-collective': 5 })
 * @returns Euclidean distance between the two profiles
 *
 * @example
 * ```typescript
 * const distance = calculateEuclideanDistance(
 *   { 'market-state': 5.5, 'individual-collective': 5.5 },
 *   { 'market-state': 7, 'individual-collective': 6 }
 * );
 * // distance ≈ 1.8028 (sqrt(1.5^2 + 0.5^2))
 * ```
 */
function calculateEuclideanDistance(
	userScores: Record<string, number>,
	partyScores: Record<string, number>
): number {
	let sumOfSquares = 0;

	// Iterate through all axes in the user profile
	for (const axis in userScores) {
		if (partyScores[axis] !== undefined) {
			const difference = userScores[axis] - partyScores[axis];
			sumOfSquares += difference * difference;
		}
	}

	return Math.sqrt(sumOfSquares);
}

/**
 * Find Best Party Match
 *
 * Finds the political party that best matches a user's ideological profile
 * using the Euclidean distance metric. The party with the smallest distance
 * is considered the best match.
 *
 * @param userProfile - User's calculated ideological profile
 * @param partyProfiles - Array of party ideological profiles (defaults to all parties)
 * @returns Party identifier of the best match
 * @throws Error if partyProfiles is empty
 *
 * @example
 * ```typescript
 * const userProfile: UserIdeologicalProfile = {
 *   axis_scores: {
 *     'market-state': 6.5,
 *     'individual-collective': 5.5,
 *     'progressive-conservative': 4.0,
 *     'ecology-economy': 7.5
 *   }
 * };
 * const bestMatch = findBestMatch(userProfile);
 * // Returns: 'Die Grünen' (example)
 * ```
 */
export function findBestMatch(
	userProfile: UserIdeologicalProfile,
	partyProfiles: PartyIdeologicalProfile[] = partyIdeologies
): Party {
	// Edge case: empty party list
	if (partyProfiles.length === 0) {
		throw new Error('Cannot find best match: party profiles list is empty');
	}

	// Edge case: single party in list
	if (partyProfiles.length === 1) {
		return partyProfiles[0].party_id as Party;
	}

	let minDistance = Infinity;
	let bestMatch: Party | null = null;

	// Find party with minimum Euclidean distance
	for (const partyProfile of partyProfiles) {
		const distance = calculateEuclideanDistance(
			userProfile.axis_scores,
			partyProfile.axis_scores
		);

		if (distance < minDistance) {
			minDistance = distance;
			bestMatch = partyProfile.party_id as Party;
		}
	}

	// This should never happen due to edge case handling above,
	// but TypeScript requires we handle the null case
	if (bestMatch === null) {
		throw new Error('Failed to find best match: no valid party found');
	}

	return bestMatch;
}
