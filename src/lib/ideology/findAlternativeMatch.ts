import type { UserIdeologicalProfile, PartyIdeologicalProfile } from './types';
import type { Party } from '$lib/parties';
import { partyIdeologies } from './partyIdeologies';
import { findBestMatch } from './findBestMatch';

/**
 * Party Classifications
 *
 * These classifications adapt the existing smallerParties logic from the
 * legacy party weights system to the new ideological framework.
 *
 * **Establishment Parties:** Major parties in government coalitions (CDU, SPD, FDP)
 * **Far-Right Parties:** Parties with far-right ideological positions (AFD)
 * **Smaller Parties:** Non-establishment, non-far-right parties (Die Grünen, Die Linke, BSW)
 */

/** Establishment parties (major coalition parties) */
export const establishmentParties: Party[] = ['CDU', 'SPD', 'FDP'];

/** Far-right parties */
export const farRightParties: Party[] = ['AFD'];

/** Smaller parties (not establishment, not far-right) */
export const smallerParties: Party[] = [
	'Die Grünen',
	'Die Linke',
	'BSW',
	'Volt',
	'Freie Wähler',
	'Tierschutzpartei',
	'ÖDP',
	'Piratenpartei'
];

/**
 * Find Alternative Party Match
 *
 * Identifies a "better alternative" party based on ideological alignment,
 * particularly when the top match is an establishment or far-right party.
 * This adapts the existing smallerParties logic to the new ideological framework.
 *
 * **Algorithm:**
 * 1. Check if top match is establishment or far-right
 * 2. If yes: Find best ideological match among smaller parties only
 * 3. If no: Return null (user's top match is already a smaller party)
 *
 * **Purpose:**
 * Guides users toward potentially more impactful choices when their top match
 * is a major establishment or far-right party, by suggesting ideologically
 * close alternatives from smaller parties.
 *
 * @param userProfile - User's calculated ideological profile
 * @param topMatch - The best overall party match (from findBestMatch)
 * @param allPartyProfiles - Array of all party ideological profiles (defaults to all parties)
 * @returns Party identifier of the best alternative, or null if no alternative is needed
 *
 * @example
 * ```typescript
 * const userProfile: UserIdeologicalProfile = {
 *   axis_scores: {
 *     'market-state': 6,
 *     'individual-collective': 6,
 *     'progressive-conservative': 4,
 *     'ecology-economy': 6
 *   }
 * };
 *
 * // If top match is SPD (establishment)
 * const alternative = findAlternativeMatch(userProfile, 'SPD');
 * // Returns: 'Die Grünen' (or another smaller party close to user's profile)
 *
 * // If top match is already a smaller party
 * const alternative2 = findAlternativeMatch(userProfile, 'Die Linke');
 * // Returns: null (no alternative needed)
 * ```
 */
export function findAlternativeMatch(
	userProfile: UserIdeologicalProfile,
	topMatch: Party,
	allPartyProfiles: PartyIdeologicalProfile[] = partyIdeologies
): Party | null {
	// Check if the top match requires an alternative suggestion
	const shouldSuggestAlternative =
		establishmentParties.includes(topMatch) || farRightParties.includes(topMatch);

	// If top match is already a smaller party, no alternative needed
	if (!shouldSuggestAlternative) {
		return null;
	}

	// Filter to get only smaller party profiles
	const smallerPartyProfiles = allPartyProfiles.filter((profile) =>
		smallerParties.includes(profile.party_id as Party)
	);

	// Edge case: No smaller parties available
	if (smallerPartyProfiles.length === 0) {
		console.warn('No smaller parties available for alternative recommendation');
		return null;
	}

	// Find the best match among smaller parties
	try {
		const alternative = findBestMatch(userProfile, smallerPartyProfiles);

		// Ensure the alternative is not the same as the top match
		// (This should never happen since we filtered by smaller parties,
		// but we check for extra safety)
		if (alternative === topMatch) {
			console.warn(`Alternative match is same as top match: ${topMatch}`);
			return null;
		}

		return alternative;
	} catch (error) {
		// If findBestMatch throws an error (e.g., empty list), return null
		console.error('Error finding alternative match:', error);
		return null;
	}
}
