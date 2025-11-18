import { describe, it, expect } from 'vitest';
import { findBestMatch } from './findBestMatch';
import { partyIdeologies } from './partyIdeologies';
import type { UserIdeologicalProfile, PartyIdeologicalProfile } from './types';
import type { Party } from '$lib/parties';

describe('Find Best Party Match', () => {
	describe('Euclidean distance calculation (AC #2, #4)', () => {
		it('should find the closest match using Euclidean distance', () => {
			// User profile very close to SPD (center-left)
			// SPD: market-state: 6, individual-collective: 6, progressive-conservative: 4, ecology-economy: 6
			const userProfile: UserIdeologicalProfile = {
				axis_scores: {
					'market-state': 6.5,
					'individual-collective': 6.5,
					'progressive-conservative': 4.5,
					'ecology-economy': 6.5
				}
			};

			const bestMatch = findBestMatch(userProfile);

			// Should match SPD (closest to these scores)
			expect(bestMatch).toBe('SPD');
		});

		it('should correctly calculate distance for exact match', () => {
			// User profile exactly matching Die Grünen
			// Die Grünen: market-state: 6, individual-collective: 6, progressive-conservative: 3, ecology-economy: 9
			const userProfile: UserIdeologicalProfile = {
				axis_scores: {
					'market-state': 6,
					'individual-collective': 6,
					'progressive-conservative': 3,
					'ecology-economy': 9
				}
			};

			const bestMatch = findBestMatch(userProfile);

			// Should match Die Grünen (distance = 0)
			expect(bestMatch).toBe('Die Grünen');
		});

		it('should find AFD for far-right conservative profile', () => {
			// User profile matching AFD characteristics
			// AFD: market-state: 3, individual-collective: 3, progressive-conservative: 9, ecology-economy: 2
			const userProfile: UserIdeologicalProfile = {
				axis_scores: {
					'market-state': 3.5,
					'individual-collective': 3.5,
					'progressive-conservative': 8.5,
					'ecology-economy': 2.5
				}
			};

			const bestMatch = findBestMatch(userProfile);

			expect(bestMatch).toBe('AFD');
		});

		it('should find FDP for free-market liberal profile', () => {
			// User profile matching FDP characteristics
			// FDP: market-state: 2, individual-collective: 3, progressive-conservative: 4, ecology-economy: 3
			const userProfile: UserIdeologicalProfile = {
				axis_scores: {
					'market-state': 2.5,
					'individual-collective': 3.5,
					'progressive-conservative': 4.5,
					'ecology-economy': 3.5
				}
			};

			const bestMatch = findBestMatch(userProfile);

			expect(bestMatch).toBe('FDP');
		});

		it('should find Die Linke for far-left profile', () => {
			// User profile matching Die Linke characteristics
			// Die Linke: market-state: 9, individual-collective: 8, progressive-conservative: 2, ecology-economy: 7
			const userProfile: UserIdeologicalProfile = {
				axis_scores: {
					'market-state': 8.5,
					'individual-collective': 7.5,
					'progressive-conservative': 2.5,
					'ecology-economy': 7.5
				}
			};

			const bestMatch = findBestMatch(userProfile);

			expect(bestMatch).toBe('Die Linke');
		});
	});

	describe('Function signature and return type (AC #1, #3)', () => {
		it('should return a valid Party type', () => {
			const userProfile: UserIdeologicalProfile = {
				axis_scores: {
					'market-state': 5.5,
					'individual-collective': 5.5,
					'progressive-conservative': 5.5,
					'ecology-economy': 5.5
				}
			};

			const bestMatch = findBestMatch(userProfile);

			// Check that the return value is a valid Party
			const validParties: Party[] = [
				'AFD',
				'BSW',
				'CDU',
				'Die Linke',
				'FDP',
				'Die Grünen',
				'SPD'
			];
			expect(validParties).toContain(bestMatch);
		});

		it('should accept userProfile and optional partyProfiles parameters', () => {
			const userProfile: UserIdeologicalProfile = {
				axis_scores: {
					'market-state': 5,
					'individual-collective': 5,
					'progressive-conservative': 5,
					'ecology-economy': 5
				}
			};

			// Test with default partyProfiles (all parties)
			const match1 = findBestMatch(userProfile);
			expect(match1).toBeDefined();

			// Test with explicit partyProfiles
			const match2 = findBestMatch(userProfile, partyIdeologies);
			expect(match2).toBeDefined();
		});
	});

	describe('Edge case handling (AC #5)', () => {
		it('should throw error for empty party list', () => {
			const userProfile: UserIdeologicalProfile = {
				axis_scores: {
					'market-state': 5,
					'individual-collective': 5,
					'progressive-conservative': 5,
					'ecology-economy': 5
				}
			};

			const emptyPartyList: PartyIdeologicalProfile[] = [];

			expect(() => findBestMatch(userProfile, emptyPartyList)).toThrow(
				'Cannot find best match: party profiles list is empty'
			);
		});

		it('should return the single party when list has only one party', () => {
			const userProfile: UserIdeologicalProfile = {
				axis_scores: {
					'market-state': 5,
					'individual-collective': 5,
					'progressive-conservative': 5,
					'ecology-economy': 5
				}
			};

			const singlePartyList: PartyIdeologicalProfile[] = [
				{
					party_id: 'SPD',
					axis_scores: {
						'market-state': 6,
						'individual-collective': 6,
						'progressive-conservative': 4,
						'ecology-economy': 6
					}
				}
			];

			const bestMatch = findBestMatch(userProfile, singlePartyList);

			expect(bestMatch).toBe('SPD');
		});

		it('should handle single party even if distance is large', () => {
			// User profile far from the single party
			const userProfile: UserIdeologicalProfile = {
				axis_scores: {
					'market-state': 1,
					'individual-collective': 1,
					'progressive-conservative': 1,
					'ecology-economy': 1
				}
			};

			const singlePartyList: PartyIdeologicalProfile[] = [
				{
					party_id: 'Die Linke',
					axis_scores: {
						'market-state': 9,
						'individual-collective': 8,
						'progressive-conservative': 2,
						'ecology-economy': 7
					}
				}
			];

			const bestMatch = findBestMatch(userProfile, singlePartyList);

			// Should still return the only available party
			expect(bestMatch).toBe('Die Linke');
		});
	});

	describe('Distance calculation accuracy (AC #4)', () => {
		it('should correctly compute Euclidean distance: sqrt(sum((user - party)^2))', () => {
			// Create a controlled test with known distances
			const userProfile: UserIdeologicalProfile = {
				axis_scores: {
					'market-state': 5,
					'individual-collective': 5,
					'progressive-conservative': 5,
					'ecology-economy': 5
				}
			};

			// Party A: distance = sqrt((5-3)^2 + (5-3)^2 + (5-3)^2 + (5-3)^2) = sqrt(16) = 4
			const partyA: PartyIdeologicalProfile = {
				party_id: 'AFD',
				axis_scores: {
					'market-state': 3,
					'individual-collective': 3,
					'progressive-conservative': 3,
					'ecology-economy': 3
				}
			};

			// Party B: distance = sqrt((5-6)^2 + (5-6)^2 + (5-6)^2 + (5-6)^2) = sqrt(4) = 2
			const partyB: PartyIdeologicalProfile = {
				party_id: 'SPD',
				axis_scores: {
					'market-state': 6,
					'individual-collective': 6,
					'progressive-conservative': 6,
					'ecology-economy': 6
				}
			};

			const testParties = [partyA, partyB];
			const bestMatch = findBestMatch(userProfile, testParties);

			// SPD should be closer (distance 2 vs AFD distance 4)
			expect(bestMatch).toBe('SPD');
		});

		it('should handle decimal axis scores correctly', () => {
			const userProfile: UserIdeologicalProfile = {
				axis_scores: {
					'market-state': 5.5,
					'individual-collective': 5.5,
					'progressive-conservative': 5.5,
					'ecology-economy': 5.5
				}
			};

			// This should find the closest match among real parties
			const bestMatch = findBestMatch(userProfile);

			expect(bestMatch).toBeDefined();
			expect(typeof bestMatch).toBe('string');
		});
	});

	describe('Real-world scenarios', () => {
		it('should find CDU for center-right conservative profile', () => {
			// User profile matching CDU characteristics
			// CDU: market-state: 4, individual-collective: 5, progressive-conservative: 7, ecology-economy: 4
			const userProfile: UserIdeologicalProfile = {
				axis_scores: {
					'market-state': 4.5,
					'individual-collective': 5.5,
					'progressive-conservative': 7.5,
					'ecology-economy': 4.5
				}
			};

			const bestMatch = findBestMatch(userProfile);

			expect(bestMatch).toBe('CDU');
		});

		it('should find BSW for Wagenknecht alliance profile', () => {
			// User profile matching BSW characteristics
			// BSW: market-state: 7, individual-collective: 7, progressive-conservative: 6, ecology-economy: 5
			const userProfile: UserIdeologicalProfile = {
				axis_scores: {
					'market-state': 7.5,
					'individual-collective': 7.5,
					'progressive-conservative': 6.5,
					'ecology-economy': 5.5
				}
			};

			const bestMatch = findBestMatch(userProfile);

			expect(bestMatch).toBe('BSW');
		});

		it('should handle centrist profile (neutral on all axes)', () => {
			// Perfectly neutral profile
			const userProfile: UserIdeologicalProfile = {
				axis_scores: {
					'market-state': 5.5,
					'individual-collective': 5.5,
					'progressive-conservative': 5.5,
					'ecology-economy': 5.5
				}
			};

			const bestMatch = findBestMatch(userProfile);

			// Should match one of the centrist parties (SPD, CDU, or BSW)
			expect(['SPD', 'CDU', 'BSW']).toContain(bestMatch);
		});
	});

	describe('Algorithm consistency', () => {
		it('should return consistent results for the same input', () => {
			const userProfile: UserIdeologicalProfile = {
				axis_scores: {
					'market-state': 6.5,
					'individual-collective': 5.5,
					'progressive-conservative': 4.5,
					'ecology-economy': 7.5
				}
			};

			const match1 = findBestMatch(userProfile);
			const match2 = findBestMatch(userProfile);
			const match3 = findBestMatch(userProfile);

			// All three should return the same result
			expect(match1).toBe(match2);
			expect(match2).toBe(match3);
		});

		it('should work with all default party profiles', () => {
			const userProfile: UserIdeologicalProfile = {
				axis_scores: {
					'market-state': 5,
					'individual-collective': 5,
					'progressive-conservative': 5,
					'ecology-economy': 5
				}
			};

			// Using default partyIdeologies (all 7 German parties)
			const bestMatch = findBestMatch(userProfile);

			expect(bestMatch).toBeDefined();
			expect(partyIdeologies.find((p) => p.party_id === bestMatch)).toBeDefined();
		});
	});
});
