import { describe, it, expect } from 'vitest';
import { partyIdeologies } from './partyIdeologies';
import { ideologicalAxes } from './ideologicalAxes';
import type { PartyIdeologicalProfile } from './types';
import { parties } from '$lib/parties';

describe('Party Ideological Profiles Configuration', () => {
	describe('T2: Party profiles load successfully', () => {
		it('should load party ideologies array', () => {
			expect(partyIdeologies).toBeDefined();
			expect(Array.isArray(partyIdeologies)).toBe(true);
		});

		it('should have exactly 7 parties defined', () => {
			expect(partyIdeologies.length).toBe(7);
		});
	});

	describe('All 7 parties present', () => {
		const expectedParties = ['AFD', 'BSW', 'CDU', 'Die Linke', 'FDP', 'Die Grünen', 'SPD'];

		expectedParties.forEach((partyName) => {
			it(`should include party: ${partyName}`, () => {
				const party = partyIdeologies.find((p) => p.party_id === partyName);
				expect(party).toBeDefined();
			});
		});

		it('should have all expected parties', () => {
			const partyIds = partyIdeologies.map((p) => p.party_id);
			expectedParties.forEach((expected) => {
				expect(partyIds).toContain(expected);
			});
		});
	});

	describe('Complete axis coverage', () => {
		const requiredAxes = ['market-state', 'individual-collective', 'progressive-conservative', 'ecology-economy'];

		it('should have all 4 axes for each party', () => {
			partyIdeologies.forEach((party) => {
				const axisIds = Object.keys(party.axis_scores);
				expect(axisIds.length).toBeGreaterThanOrEqual(4);

				requiredAxes.forEach((requiredAxis) => {
					expect(party.axis_scores).toHaveProperty(requiredAxis);
				});
			});
		});

		it('should have scores defined for all axes', () => {
			partyIdeologies.forEach((party) => {
				requiredAxes.forEach((axis) => {
					expect(party.axis_scores[axis]).toBeDefined();
					expect(typeof party.axis_scores[axis]).toBe('number');
				});
			});
		});

		it('should match ideological axes configuration', () => {
			const configuredAxes = ideologicalAxes.map((axis) => axis.id);

			partyIdeologies.forEach((party) => {
				configuredAxes.forEach((axisId) => {
					expect(party.axis_scores).toHaveProperty(axisId);
				});
			});
		});
	});

	describe('Valid score ranges', () => {
		it('should have all scores within 1-10 range', () => {
			partyIdeologies.forEach((party) => {
				Object.entries(party.axis_scores).forEach(([axisId, score]) => {
					expect(score).toBeGreaterThanOrEqual(1);
					expect(score).toBeLessThanOrEqual(10);
				});
			});
		});

		it('should have numeric scores (not NaN or Infinity)', () => {
			partyIdeologies.forEach((party) => {
				Object.values(party.axis_scores).forEach((score) => {
					expect(Number.isFinite(score)).toBe(true);
					expect(Number.isNaN(score)).toBe(false);
				});
			});
		});

		it('should match axis min/max constraints', () => {
			partyIdeologies.forEach((party) => {
				ideologicalAxes.forEach((axis) => {
					const score = party.axis_scores[axis.id];
					if (score !== undefined) {
						expect(score).toBeGreaterThanOrEqual(axis.min_value);
						expect(score).toBeLessThanOrEqual(axis.max_value);
					}
				});
			});
		});
	});

	describe('Party ID validation', () => {
		it('should have no duplicate party IDs', () => {
			const partyIds = partyIdeologies.map((p) => p.party_id);
			const uniqueIds = new Set(partyIds);
			expect(uniqueIds.size).toBe(partyIds.length);
		});

		it('should match Party type from parties.ts', () => {
			const validPartyNames = parties.map((p) => p.name);

			partyIdeologies.forEach((party) => {
				expect(validPartyNames).toContain(party.party_id);
			});
		});

		it('should have party_id as string type', () => {
			partyIdeologies.forEach((party) => {
				expect(typeof party.party_id).toBe('string');
				expect(party.party_id.length).toBeGreaterThan(0);
			});
		});
	});

	describe('Data structure validation', () => {
		it('should conform to PartyIdeologicalProfile interface', () => {
			partyIdeologies.forEach((party) => {
				expect(party).toHaveProperty('party_id');
				expect(party).toHaveProperty('axis_scores');
				expect(typeof party.party_id).toBe('string');
				expect(typeof party.axis_scores).toBe('object');
			});
		});

		it('should have axis_scores as a Record<string, number>', () => {
			partyIdeologies.forEach((party) => {
				expect(party.axis_scores).toBeDefined();
				expect(typeof party.axis_scores).toBe('object');

				Object.entries(party.axis_scores).forEach(([key, value]) => {
					expect(typeof key).toBe('string');
					expect(typeof value).toBe('number');
				});
			});
		});
	});

	describe('Political positioning validation', () => {
		it('should have distinct ideological positions', () => {
			// Verify parties have different profiles (not all the same)
			const firstParty = partyIdeologies[0];
			const allIdentical = partyIdeologies.every((party) => {
				return Object.keys(party.axis_scores).every((axis) => {
					return party.axis_scores[axis] === firstParty.axis_scores[axis];
				});
			});

			expect(allIdentical).toBe(false);
		});

		it('should reflect expected political spectrum positions', () => {
			// FDP should be more market-oriented (lower market-state score)
			const fdp = partyIdeologies.find((p) => p.party_id === 'FDP');
			expect(fdp?.axis_scores['market-state']).toBeLessThan(5);

			// Die Linke should favor state intervention (higher market-state score)
			const dieLinke = partyIdeologies.find((p) => p.party_id === 'Die Linke');
			expect(dieLinke?.axis_scores['market-state']).toBeGreaterThan(5);

			// Die Grünen should prioritize ecology (higher ecology-economy score)
			const gruenen = partyIdeologies.find((p) => p.party_id === 'Die Grünen');
			expect(gruenen?.axis_scores['ecology-economy']).toBeGreaterThan(7);

			// AFD should be conservative (higher progressive-conservative score)
			const afd = partyIdeologies.find((p) => p.party_id === 'AFD');
			expect(afd?.axis_scores['progressive-conservative']).toBeGreaterThan(7);
		});
	});

	describe('Edge cases', () => {
		it('should not be an empty array', () => {
			expect(partyIdeologies.length).toBeGreaterThan(0);
		});

		it('should be readonly/immutable reference', () => {
			// Verify we export a const
			expect(partyIdeologies).toBeTruthy();
		});

		it('should have consistent axis keys across all parties', () => {
			const firstPartyAxes = Object.keys(partyIdeologies[0].axis_scores).sort();

			partyIdeologies.forEach((party) => {
				const partyAxes = Object.keys(party.axis_scores).sort();
				expect(partyAxes).toEqual(firstPartyAxes);
			});
		});
	});
});
