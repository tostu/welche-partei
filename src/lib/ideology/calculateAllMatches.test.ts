import { describe, it, expect } from 'vitest';
import { getAxisWeights, calculateAllPartyMatches } from './calculateAllMatches';
import type { UserProfile } from '$lib/profiling/types';
import type { UserIdeologicalProfile } from './types';

describe('Axis Weighting and Party Matching', () => {
	describe('getAxisWeights', () => {
		it('should return default weights of 1.0 for empty profile', () => {
			const profile: UserProfile = {};
			const weights = getAxisWeights(profile);
			expect(weights['market-state']).toBe(1.0);
			expect(weights['individual-collective']).toBe(1.0);
			expect(weights['progressive-conservative']).toBe(1.0);
			expect(weights['ecology-economy']).toBe(1.0);
		});

		it('should boost economic weights to 2.5 when user has socio-economic priority and is working', () => {
			const profile: UserProfile = {
				'age-group': '30-50',
				'employment-status-mid': 'employed',
				'working-priorities': 'pension-security'
			};
			const weights = getAxisWeights(profile);
			expect(weights['market-state']).toBe(2.5);
			expect(weights['individual-collective']).toBe(2.5);
			expect(weights['progressive-conservative']).toBe(1.0);
			expect(weights['ecology-economy']).toBe(1.0);
		});

		it('should boost economic weights to 2.0 when user has socio-economic priority but is not working', () => {
			const profile: UserProfile = {
				'age-group': 'over-50',
				'retirement-status': 'retired',
				'retirement-priorities': 'pension-amount'
			};
			const weights = getAxisWeights(profile);
			expect(weights['market-state']).toBe(2.0);
			expect(weights['individual-collective']).toBe(2.0);
			expect(weights['progressive-conservative']).toBe(1.0);
			expect(weights['ecology-economy']).toBe(1.0);
		});

		it('should boost ecology-economy weight to 2.0 when user has climate priority', () => {
			const profile: UserProfile = {
				'age-group': 'under-30',
				'employment-status-young': 'student',
				'student-priorities': 'climate-future'
			};
			const weights = getAxisWeights(profile);
			expect(weights['market-state']).toBe(1.0);
			expect(weights['individual-collective']).toBe(1.0);
			expect(weights['progressive-conservative']).toBe(1.0);
			expect(weights['ecology-economy']).toBe(2.0);
		});
	});

	describe('calculateAllPartyMatches', () => {
		const userProfile: UserIdeologicalProfile = {
			axis_scores: {
				'market-state': 8.5,
				'individual-collective': 10,
				'progressive-conservative': 8.8,
				'ecology-economy': 3.5
			}
		};

		it('should rank BSW/Die Linke/SPD higher than CDU when economic/social priority is weighted', () => {
			const profilingProfile: UserProfile = {
				'age-group': '30-50',
				'employment-status-mid': 'employed',
				'working-priorities': 'pension-security'
			};

			const matches = calculateAllPartyMatches(userProfile, undefined, profilingProfile);
			
			// Expected matches: BSW and Die Linke/SPD should rank higher than CDU
			const bswRank = matches.findIndex((m) => m.partyId === 'BSW');
			const linkeRank = matches.findIndex((m) => m.partyId === 'Die Linke');
			const spdRank = matches.findIndex((m) => m.partyId === 'SPD');
			const cduRank = matches.findIndex((m) => m.partyId === 'CDU');

			expect(bswRank).toBeLessThan(cduRank);
			expect(linkeRank).toBeLessThan(cduRank);
			expect(spdRank).toBeLessThan(cduRank);
		});

		it('should rank CDU higher when default unweighted calculation is used', () => {
			// Without profilingProfile (default/empty weights)
			const matches = calculateAllPartyMatches(userProfile, undefined, {});

			const bswRank = matches.findIndex((m) => m.partyId === 'BSW');
			const cduRank = matches.findIndex((m) => m.partyId === 'CDU');
			const linkeRank = matches.findIndex((m) => m.partyId === 'Die Linke');
			const spdRank = matches.findIndex((m) => m.partyId === 'SPD');

			// Under unweighted Euclidean distance, BSW is first, then CDU
			expect(bswRank).toBe(0);
			expect(cduRank).toBe(1);
			expect(spdRank).toBeGreaterThan(cduRank);
			expect(linkeRank).toBeGreaterThan(cduRank);
		});
	});
});
