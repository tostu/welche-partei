import type { Party } from '$lib/parties';
import type { PartyIdeologicalProfile } from './types';

/**
 * Party Ideological Profiles Configuration
 *
 * Defines each political party's position across all ideological axes.
 * Scores range from 1-10 on each axis, representing the party's policy stance.
 *
 * These profiles enable ideology-based matching by comparing user ideological profiles
 * (calculated from narrative quiz responses) against party positions using distance metrics.
 *
 * Axis Definitions:
 * - market-state: Economic approach (1 = Free Market, 10 = State Control)
 * - individual-collective: Social priority (1 = Individual First, 10 = Collective First)
 * - progressive-conservative: Social values (1 = Progressive, 10 = Conservative)
 * - ecology-economy: Environmental priority (1 = Economy First, 10 = Ecology First)
 */
export const partyIdeologies: PartyIdeologicalProfile[] = [
	{
		party_id: 'AFD' as Party,
		axis_scores: {
			'market-state': 3, // Market-oriented economic policies
			'individual-collective': 3, // Individual freedom emphasis
			'progressive-conservative': 9, // Strong conservative values
			'ecology-economy': 2 // Economy-first approach
		}
	},
	{
		party_id: 'BSW' as Party,
		axis_scores: {
			'market-state': 7, // State intervention in economy
			'individual-collective': 7, // Collective responsibility
			'progressive-conservative': 6, // Mixed progressive-conservative
			'ecology-economy': 5 // Balanced approach
		}
	},
	{
		party_id: 'CDU' as Party,
		axis_scores: {
			'market-state': 4, // Moderate market orientation
			'individual-collective': 5, // Balanced individual-collective
			'progressive-conservative': 7, // Traditional values
			'ecology-economy': 4 // Moderate environmental concern
		}
	},
	{
		party_id: 'Die Linke' as Party,
		axis_scores: {
			'market-state': 8, // Strong state intervention
			'individual-collective': 8, // Collective responsibility
			'progressive-conservative': 2, // Progressive values
			'ecology-economy': 7 // Environmental priority
		}
	},
	{
		party_id: 'FDP' as Party,
		axis_scores: {
			'market-state': 2, // Free market approach
			'individual-collective': 2, // Individual freedom
			'progressive-conservative': 4, // Moderately progressive
			'ecology-economy': 3 // Economy-leaning
		}
	},
	{
		party_id: 'Die Grünen' as Party,
		axis_scores: {
			'market-state': 6, // Moderate state intervention
			'individual-collective': 7, // Collective responsibility
			'progressive-conservative': 2, // Progressive values
			'ecology-economy': 9 // Ecology first
		}
	},
	{
		party_id: 'SPD' as Party,
		axis_scores: {
			'market-state': 6, // Balanced market-state
			'individual-collective': 6, // Collective emphasis
			'progressive-conservative': 3, // Progressive values
			'ecology-economy': 6 // Environmental concern
		}
	},
	{
		party_id: 'Volt' as Party,
		axis_scores: {
			'market-state': 5,
			'individual-collective': 6,
			'progressive-conservative': 2,
			'ecology-economy': 8
		}
	},
	{
		party_id: 'Freie Wähler' as Party,
		axis_scores: {
			'market-state': 4,
			'individual-collective': 5,
			'progressive-conservative': 7,
			'ecology-economy': 5
		}
	},
	{
		party_id: 'Tierschutzpartei' as Party,
		axis_scores: {
			'market-state': 7,
			'individual-collective': 8,
			'progressive-conservative': 3,
			'ecology-economy': 9
		}
	},
	{
		party_id: 'ÖDP' as Party,
		axis_scores: {
			'market-state': 6,
			'individual-collective': 7,
			'progressive-conservative': 6,
			'ecology-economy': 10
		}
	},
	{
		party_id: 'Piratenpartei' as Party,
		axis_scores: {
			'market-state': 6,
			'individual-collective': 3,
			'progressive-conservative': 2,
			'ecology-economy': 7
		}
	}
];
