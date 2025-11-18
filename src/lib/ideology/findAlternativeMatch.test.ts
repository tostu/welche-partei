import { describe, it, expect } from 'vitest';
import {
	findAlternativeMatch,
	establishmentParties,
	farRightParties,
	smallerParties
} from './findAlternativeMatch';
import { partyIdeologies } from './partyIdeologies';
import type { UserIdeologicalProfile, PartyIdeologicalProfile } from './types';
import type { Party } from '$lib/parties';

describe('Find Alternative Party Match', () => {
	describe('Party Classifications (AC #1)', () => {
		it('should correctly classify establishment parties', () => {
			expect(establishmentParties).toEqual(['CDU', 'SPD', 'FDP']);
			expect(establishmentParties.length).toBe(3);
		});

		it('should correctly classify far-right parties', () => {
			expect(farRightParties).toEqual(['AFD']);
			expect(farRightParties.length).toBe(1);
		});

		it('should correctly classify smaller parties', () => {
			expect(smallerParties).toEqual(['Die Grünen', 'Die Linke', 'BSW']);
			expect(smallerParties.length).toBe(3);
		});

		it('should have all parties classified in exactly one category', () => {
			const allClassifiedParties = [
				...establishmentParties,
				...farRightParties,
				...smallerParties
			];

			// All 7 German parties should be classified
			expect(allClassifiedParties.length).toBe(7);

			// No duplicates
			const uniqueParties = new Set(allClassifiedParties);
			expect(uniqueParties.size).toBe(7);
		});
	});

	describe('Establishment party alternatives (AC #2)', () => {
		it('should suggest alternative when top match is CDU', () => {
			// User profile close to center-left
			const userProfile: UserIdeologicalProfile = {
				axis_scores: {
					'market-state': 6,
					'individual-collective': 6,
					'progressive-conservative': 4,
					'ecology-economy': 6
				}
			};

			const alternative = findAlternativeMatch(userProfile, 'CDU');

			// Should return one of the smaller parties
			expect(alternative).not.toBeNull();
			expect(smallerParties).toContain(alternative as Party);
		});

		it('should suggest alternative when top match is SPD', () => {
			// User profile close to SPD but should get smaller party alternative
			const userProfile: UserIdeologicalProfile = {
				axis_scores: {
					'market-state': 6,
					'individual-collective': 6,
					'progressive-conservative': 4,
					'ecology-economy': 6
				}
			};

			const alternative = findAlternativeMatch(userProfile, 'SPD');

			expect(alternative).not.toBeNull();
			expect(smallerParties).toContain(alternative as Party);
			expect(alternative).not.toBe('SPD');
		});

		it('should suggest alternative when top match is FDP', () => {
			// User profile close to FDP but should get smaller party alternative
			const userProfile: UserIdeologicalProfile = {
				axis_scores: {
					'market-state': 2,
					'individual-collective': 3,
					'progressive-conservative': 4,
					'ecology-economy': 3
				}
			};

			const alternative = findAlternativeMatch(userProfile, 'FDP');

			expect(alternative).not.toBeNull();
			expect(smallerParties).toContain(alternative as Party);
			expect(alternative).not.toBe('FDP');
		});
	});

	describe('Far-right party alternatives (AC #2)', () => {
		it('should suggest alternative when top match is AFD', () => {
			// User profile far-right conservative
			const userProfile: UserIdeologicalProfile = {
				axis_scores: {
					'market-state': 3,
					'individual-collective': 3,
					'progressive-conservative': 9,
					'ecology-economy': 2
				}
			};

			const alternative = findAlternativeMatch(userProfile, 'AFD');

			// Should return one of the smaller parties
			expect(alternative).not.toBeNull();
			expect(smallerParties).toContain(alternative as Party);
			expect(alternative).not.toBe('AFD');
		});
	});

	describe('Smaller party top matches (AC #2)', () => {
		it('should return null when top match is Die Grünen', () => {
			// User profile matching Die Grünen
			const userProfile: UserIdeologicalProfile = {
				axis_scores: {
					'market-state': 6,
					'individual-collective': 6,
					'progressive-conservative': 3,
					'ecology-economy': 9
				}
			};

			const alternative = findAlternativeMatch(userProfile, 'Die Grünen');

			// No alternative needed - already a smaller party
			expect(alternative).toBeNull();
		});

		it('should return null when top match is Die Linke', () => {
			// User profile matching Die Linke
			const userProfile: UserIdeologicalProfile = {
				axis_scores: {
					'market-state': 9,
					'individual-collective': 8,
					'progressive-conservative': 2,
					'ecology-economy': 7
				}
			};

			const alternative = findAlternativeMatch(userProfile, 'Die Linke');

			expect(alternative).toBeNull();
		});

		it('should return null when top match is BSW', () => {
			// User profile matching BSW
			const userProfile: UserIdeologicalProfile = {
				axis_scores: {
					'market-state': 7,
					'individual-collective': 7,
					'progressive-conservative': 6,
					'ecology-economy': 5
				}
			};

			const alternative = findAlternativeMatch(userProfile, 'BSW');

			expect(alternative).toBeNull();
		});
	});

	describe('Ideological closeness (AC #2)', () => {
		it('should select alternative based on ideological closeness among smaller parties', () => {
			// User profile very close to Die Grünen characteristics
			// Die Grünen: market-state: 6, individual-collective: 6, progressive-conservative: 3, ecology-economy: 9
			const userProfile: UserIdeologicalProfile = {
				axis_scores: {
					'market-state': 6.5,
					'individual-collective': 6.5,
					'progressive-conservative': 3.5,
					'ecology-economy': 8.5
				}
			};

			// If top match is CDU (establishment), alternative should be Die Grünen (closest smaller party)
			const alternative = findAlternativeMatch(userProfile, 'CDU');

			expect(alternative).toBe('Die Grünen');
		});

		it('should find Die Linke as alternative for far-left leaning user with establishment top match', () => {
			// User profile very close to Die Linke
			// Die Linke: market-state: 9, individual-collective: 8, progressive-conservative: 2, ecology-economy: 7
			const userProfile: UserIdeologicalProfile = {
				axis_scores: {
					'market-state': 8.5,
					'individual-collective': 7.5,
					'progressive-conservative': 2.5,
					'ecology-economy': 7.5
				}
			};

			// Even if top match is SPD, alternative should be Die Linke (closest ideologically)
			const alternative = findAlternativeMatch(userProfile, 'SPD');

			expect(alternative).toBe('Die Linke');
		});

		it('should find BSW as alternative for centrist-left user with establishment top match', () => {
			// User profile very close to BSW
			// BSW: market-state: 7, individual-collective: 7, progressive-conservative: 6, ecology-economy: 5
			const userProfile: UserIdeologicalProfile = {
				axis_scores: {
					'market-state': 7.5,
					'individual-collective': 7.5,
					'progressive-conservative': 6.5,
					'ecology-economy': 5.5
				}
			};

			const alternative = findAlternativeMatch(userProfile, 'CDU');

			expect(alternative).toBe('BSW');
		});
	});

	describe('Edge cases (AC #2)', () => {
		it('should handle empty smaller party list gracefully', () => {
			// Create party profiles with NO smaller parties
			const noSmallerParties: PartyIdeologicalProfile[] = partyIdeologies.filter(
				(p) => !smallerParties.includes(p.party_id as Party)
			);

			const userProfile: UserIdeologicalProfile = {
				axis_scores: {
					'market-state': 5,
					'individual-collective': 5,
					'progressive-conservative': 5,
					'ecology-economy': 5
				}
			};

			const alternative = findAlternativeMatch(userProfile, 'CDU', noSmallerParties);

			// Should return null if no smaller parties available
			expect(alternative).toBeNull();
		});

		it('should handle single smaller party available', () => {
			// Create party profiles with only Die Grünen as smaller party
			const onlyGruene: PartyIdeologicalProfile[] = partyIdeologies.filter(
				(p) => p.party_id === 'Die Grünen' || !smallerParties.includes(p.party_id as Party)
			);

			const userProfile: UserIdeologicalProfile = {
				axis_scores: {
					'market-state': 5,
					'individual-collective': 5,
					'progressive-conservative': 5,
					'ecology-economy': 5
				}
			};

			const alternative = findAlternativeMatch(userProfile, 'CDU', onlyGruene);

			// Should return the only available smaller party
			expect(alternative).toBe('Die Grünen');
		});

		it('should not return top match as alternative', () => {
			const userProfile: UserIdeologicalProfile = {
				axis_scores: {
					'market-state': 5,
					'individual-collective': 5,
					'progressive-conservative': 5,
					'ecology-economy': 5
				}
			};

			// Test all establishment and far-right parties
			const partiesToTest: Party[] = [...establishmentParties, ...farRightParties];

			partiesToTest.forEach((party) => {
				const alternative = findAlternativeMatch(userProfile, party);

				if (alternative !== null) {
					// Alternative should never be the same as top match
					expect(alternative).not.toBe(party);
				}
			});
		});
	});

	describe('Function signature and return types', () => {
		it('should accept userProfile and topMatch as required parameters', () => {
			const userProfile: UserIdeologicalProfile = {
				axis_scores: {
					'market-state': 5,
					'individual-collective': 5,
					'progressive-conservative': 5,
					'ecology-economy': 5
				}
			};

			// Should work with just two parameters
			const result = findAlternativeMatch(userProfile, 'CDU');
			expect(result).toBeDefined();
		});

		it('should accept optional allPartyProfiles parameter', () => {
			const userProfile: UserIdeologicalProfile = {
				axis_scores: {
					'market-state': 5,
					'individual-collective': 5,
					'progressive-conservative': 5,
					'ecology-economy': 5
				}
			};

			// Should work with explicit partyProfiles
			const result = findAlternativeMatch(userProfile, 'CDU', partyIdeologies);
			expect(result).toBeDefined();
		});

		it('should return Party type or null', () => {
			const userProfile: UserIdeologicalProfile = {
				axis_scores: {
					'market-state': 5,
					'individual-collective': 5,
					'progressive-conservative': 5,
					'ecology-economy': 5
				}
			};

			// Establishment match should return Party
			const result1 = findAlternativeMatch(userProfile, 'CDU');
			if (result1 !== null) {
				expect(typeof result1).toBe('string');
				expect(smallerParties).toContain(result1);
			}

			// Smaller party match should return null
			const result2 = findAlternativeMatch(userProfile, 'Die Linke');
			expect(result2).toBeNull();
		});
	});

	describe('Integration with findBestMatch', () => {
		it('should use Euclidean distance for alternative selection', () => {
			// Create a user profile that is clearly closer to one smaller party than others
			// Die Grünen: market-state: 6, individual-collective: 6, progressive-conservative: 3, ecology-economy: 9
			// Die Linke: market-state: 9, individual-collective: 8, progressive-conservative: 2, ecology-economy: 7
			// BSW: market-state: 7, individual-collective: 7, progressive-conservative: 6, ecology-economy: 5

			// User very close to Die Grünen (distance ~0.5)
			const userProfile: UserIdeologicalProfile = {
				axis_scores: {
					'market-state': 6,
					'individual-collective': 6,
					'progressive-conservative': 3,
					'ecology-economy': 9.5
				}
			};

			const alternative = findAlternativeMatch(userProfile, 'SPD');

			// Should pick Die Grünen (closest by Euclidean distance)
			expect(alternative).toBe('Die Grünen');
		});
	});

	describe('Real-world scenarios', () => {
		it('should suggest Die Grünen for eco-progressive user with CDU top match', () => {
			const userProfile: UserIdeologicalProfile = {
				axis_scores: {
					'market-state': 5,
					'individual-collective': 5,
					'progressive-conservative': 3,
					'ecology-economy': 8
				}
			};

			const alternative = findAlternativeMatch(userProfile, 'CDU');

			expect(alternative).toBe('Die Grünen');
		});

		it('should suggest Die Linke for far-left user with SPD top match', () => {
			const userProfile: UserIdeologicalProfile = {
				axis_scores: {
					'market-state': 9,
					'individual-collective': 8,
					'progressive-conservative': 2,
					'ecology-economy': 7
				}
			};

			const alternative = findAlternativeMatch(userProfile, 'SPD');

			expect(alternative).toBe('Die Linke');
		});

		it('should suggest BSW for populist-left user with far-right AFD top match', () => {
			// User with mixed profile: state control + somewhat conservative but not extreme
			// BSW characteristics: market-state: 7, individual-collective: 7, progressive-conservative: 6
			const userProfile: UserIdeologicalProfile = {
				axis_scores: {
					'market-state': 7.5,
					'individual-collective': 7,
					'progressive-conservative': 7,
					'ecology-economy': 4
				}
			};

			const alternative = findAlternativeMatch(userProfile, 'AFD');

			expect(alternative).toBe('BSW');
		});
	});
});
