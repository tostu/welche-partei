import type { UserIdeologicalProfile, PartyIdeologicalProfile } from './types';
import type { Party, PartyData } from '$lib/parties';
import { parties } from '$lib/parties';
import { partyIdeologies } from './partyIdeologies';

export interface PartyMatch {
	party: PartyData;
	partyId: Party;
	distance: number;
	matchPercentage: number;
	axisDistances: Record<string, number>;
}

/**
 * Calculate Euclidean Distance for all axes
 */
function calculateEuclideanDistance(
	userScores: Record<string, number>,
	partyScores: Record<string, number>
): { distance: number; axisDistances: Record<string, number> } {
	let sumOfSquares = 0;
	const axisDistances: Record<string, number> = {};

	for (const axis in userScores) {
		if (partyScores[axis] !== undefined) {
			const difference = userScores[axis] - partyScores[axis];
			axisDistances[axis] = Math.abs(difference);
			sumOfSquares += difference * difference;
		}
	}

	return {
		distance: Math.sqrt(sumOfSquares),
		axisDistances
	};
}

/**
 * Convert distance to match percentage
 * Smaller distance = higher percentage
 * Maximum possible distance across 4 axes (1-10 scale) is sqrt(4 * 9^2) ≈ 18
 * We'll use a max distance of 18 for normalization
 */
function distanceToPercentage(distance: number): number {
	const maxDistance = 18; // Theoretical max: sqrt(4 * 9^2)
	const percentage = Math.max(0, 100 - (distance / maxDistance) * 100);
	return percentage;
}

/**
 * Calculate match percentages for all parties
 * Returns sorted array with best matches first
 */
export function calculateAllPartyMatches(
	userProfile: UserIdeologicalProfile,
	partyProfiles: PartyIdeologicalProfile[] = partyIdeologies
): PartyMatch[] {
	const matches: PartyMatch[] = [];

	for (const partyProfile of partyProfiles) {
		const { distance, axisDistances } = calculateEuclideanDistance(
			userProfile.axis_scores,
			partyProfile.axis_scores
		);

		const partyData = parties.find((p) => p.name === partyProfile.party_id);
		if (!partyData) continue;

		matches.push({
			party: partyData,
			partyId: partyProfile.party_id as Party,
			distance,
			matchPercentage: distanceToPercentage(distance),
			axisDistances
		});
	}

	// Sort by distance (ascending) = best match first
	return matches.sort((a, b) => a.distance - b.distance);
}
