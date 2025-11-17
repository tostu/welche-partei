import { describe, it, expect } from 'vitest';
import { calculateUserIdeology, mockNarrativeQuestions } from './calculateUserIdeology';
import { ideologicalAxes } from './ideologicalAxes';
import type { UserQuizAnswers, UserIdeologicalProfile, NarrativeAnswerImpact } from './types';

describe('Calculate User Ideological Profile', () => {
	describe('Initialization at neutral midpoint (AC #4)', () => {
		it('should initialize all axes at neutral midpoint with no quiz answers', () => {
			const emptyAnswers: UserQuizAnswers = {
				narrative_choices: {}
			};

			const profile = calculateUserIdeology(emptyAnswers);

			// All axes should be at midpoint (5.5 for 1-10 range)
			ideologicalAxes.forEach((axis) => {
				const expectedMidpoint = (axis.min_value + axis.max_value) / 2;
				expect(profile.axis_scores[axis.id]).toBe(expectedMidpoint);
			});
		});

		it('should have all ideological axes in the output', () => {
			const emptyAnswers: UserQuizAnswers = {
				narrative_choices: {}
			};

			const profile = calculateUserIdeology(emptyAnswers);

			ideologicalAxes.forEach((axis) => {
				expect(profile.axis_scores).toHaveProperty(axis.id);
			});
		});
	});

	describe('Positive delta application (AC #2)', () => {
		it('should correctly apply positive delta values', () => {
			// Answer that moves toward state control (+2 on market-state)
			const answers: UserQuizAnswers = {
				narrative_choices: {
					1: 'B' // Option B: Strong government regulation (+2 market-state, +1 individual-collective)
				}
			};

			const profile = calculateUserIdeology(answers);

			// market-state should be 5.5 (midpoint) + 2 = 7.5
			expect(profile.axis_scores['market-state']).toBe(7.5);

			// individual-collective should be 5.5 (midpoint) + 1 = 6.5
			expect(profile.axis_scores['individual-collective']).toBe(6.5);
		});

		it('should accumulate multiple positive deltas', () => {
			const answers: UserQuizAnswers = {
				narrative_choices: {
					1: 'B', // +2 market-state, +1 individual-collective
					2: 'B' // +2 ecology-economy
				}
			};

			const profile = calculateUserIdeology(answers);

			expect(profile.axis_scores['market-state']).toBe(7.5);
			expect(profile.axis_scores['ecology-economy']).toBe(7.5);
		});
	});

	describe('Negative delta application (AC #2)', () => {
		it('should correctly apply negative delta values', () => {
			// Answer that moves toward free market (-2 on market-state)
			const answers: UserQuizAnswers = {
				narrative_choices: {
					1: 'A' // Option A: Free market (-2 market-state, -1 individual-collective)
				}
			};

			const profile = calculateUserIdeology(answers);

			// market-state should be 5.5 (midpoint) - 2 = 3.5
			expect(profile.axis_scores['market-state']).toBe(3.5);

			// individual-collective should be 5.5 (midpoint) - 1 = 4.5
			expect(profile.axis_scores['individual-collective']).toBe(4.5);
		});

		it('should handle mixed positive and negative deltas', () => {
			const answers: UserQuizAnswers = {
				narrative_choices: {
					1: 'A', // -2 market-state (= 3.5)
					3: 'B' // +2 progressive-conservative (= 7.5)
				}
			};

			const profile = calculateUserIdeology(answers);

			expect(profile.axis_scores['market-state']).toBe(3.5);
			expect(profile.axis_scores['progressive-conservative']).toBe(7.5);
		});
	});

	describe('Score clamping (AC #5)', () => {
		it('should clamp scores to maximum value (10)', () => {
			// Create custom questions with large deltas
			const extremeQuestions = [
				{
					id: 99,
					question: 'Extreme test',
					optionA: {
						text: 'A',
						impacts: [{ axis_id: 'market-state', delta: 10 }] // 5.5 + 10 = 15.5, should clamp to 10
					},
					optionB: {
						text: 'B',
						impacts: []
					}
				}
			];

			const answers: UserQuizAnswers = {
				narrative_choices: { 99: 'A' }
			};

			const profile = calculateUserIdeology(answers, extremeQuestions);

			expect(profile.axis_scores['market-state']).toBe(10); // Clamped to max
		});

		it('should clamp scores to minimum value (1)', () => {
			// Create custom questions with large negative deltas
			const extremeQuestions = [
				{
					id: 98,
					question: 'Extreme test',
					optionA: {
						text: 'A',
						impacts: [{ axis_id: 'market-state', delta: -10 }] // 5.5 - 10 = -4.5, should clamp to 1
					},
					optionB: {
						text: 'B',
						impacts: []
					}
				}
			];

			const answers: UserQuizAnswers = {
				narrative_choices: { 98: 'A' }
			};

			const profile = calculateUserIdeology(answers, extremeQuestions);

			expect(profile.axis_scores['market-state']).toBe(1); // Clamped to min
		});

		it('should not clamp scores within valid range', () => {
			const answers: UserQuizAnswers = {
				narrative_choices: {
					1: 'A' // -2 market-state = 3.5 (valid, no clamping needed)
				}
			};

			const profile = calculateUserIdeology(answers);

			expect(profile.axis_scores['market-state']).toBe(3.5);
			expect(profile.axis_scores['market-state']).toBeGreaterThanOrEqual(1);
			expect(profile.axis_scores['market-state']).toBeLessThanOrEqual(10);
		});
	});

	describe('Output interface validation (AC #3)', () => {
		it('should return UserIdeologicalProfile with axis_scores', () => {
			const answers: UserQuizAnswers = {
				narrative_choices: { 1: 'A' }
			};

			const profile = calculateUserIdeology(answers);

			expect(profile).toHaveProperty('axis_scores');
			expect(typeof profile.axis_scores).toBe('object');
		});

		it('should have Record<string, number> for axis_scores', () => {
			const answers: UserQuizAnswers = {
				narrative_choices: { 1: 'A', 2: 'B' }
			};

			const profile = calculateUserIdeology(answers);

			Object.entries(profile.axis_scores).forEach(([key, value]) => {
				expect(typeof key).toBe('string');
				expect(typeof value).toBe('number');
			});
		});

		it('should have numeric scores (not NaN or Infinity)', () => {
			const answers: UserQuizAnswers = {
				narrative_choices: { 1: 'A', 2: 'B', 3: 'A' }
			};

			const profile = calculateUserIdeology(answers);

			Object.values(profile.axis_scores).forEach((score) => {
				expect(Number.isFinite(score)).toBe(true);
				expect(Number.isNaN(score)).toBe(false);
			});
		});
	});

	describe('Graceful degradation', () => {
		it('should handle missing narrative questions gracefully', () => {
			// Answer references a question ID that doesn't exist
			const answers: UserQuizAnswers = {
				narrative_choices: {
					1: 'A', // Valid question
					999: 'B' // Non-existent question
				}
			};

			const profile = calculateUserIdeology(answers);

			// Should still process valid questions
			expect(profile.axis_scores['market-state']).toBe(3.5);

			// Should not throw an error
			expect(profile.axis_scores).toBeDefined();
		});

		it('should handle impacts for non-existent axes gracefully', () => {
			const badQuestions = [
				{
					id: 97,
					question: 'Test',
					optionA: {
						text: 'A',
						impacts: [
							{ axis_id: 'market-state', delta: -1 }, // Valid axis
							{ axis_id: 'non-existent-axis', delta: 5 } // Invalid axis
						]
					},
					optionB: {
						text: 'B',
						impacts: []
					}
				}
			];

			const answers: UserQuizAnswers = {
				narrative_choices: { 97: 'A' }
			};

			const profile = calculateUserIdeology(answers, badQuestions);

			// Should process valid axis impact
			expect(profile.axis_scores['market-state']).toBe(4.5);

			// Should not have the invalid axis
			expect(profile.axis_scores['non-existent-axis']).toBeUndefined();
		});

		it('should handle empty narrative_choices', () => {
			const answers: UserQuizAnswers = {
				narrative_choices: {}
			};

			const profile = calculateUserIdeology(answers);

			// All scores should be at midpoint
			expect(profile.axis_scores['market-state']).toBe(5.5);
			expect(profile.axis_scores['individual-collective']).toBe(5.5);
			expect(profile.axis_scores['progressive-conservative']).toBe(5.5);
			expect(profile.axis_scores['ecology-economy']).toBe(5.5);
		});
	});

	describe('Full quiz scenarios', () => {
		it('should correctly calculate profile for full quiz (all questions answered)', () => {
			const answers: UserQuizAnswers = {
				narrative_choices: {
					1: 'A', // -2 market-state, -1 individual-collective
					2: 'B', // +2 ecology-economy
					3: 'A' // -2 progressive-conservative
				}
			};

			const profile = calculateUserIdeology(answers);

			expect(profile.axis_scores['market-state']).toBe(3.5); // 5.5 - 2
			expect(profile.axis_scores['individual-collective']).toBe(4.5); // 5.5 - 1
			expect(profile.axis_scores['progressive-conservative']).toBe(3.5); // 5.5 - 2
			expect(profile.axis_scores['ecology-economy']).toBe(7.5); // 5.5 + 2
		});

		it('should calculate distinct profiles for different answer sets', () => {
			const answersA: UserQuizAnswers = {
				narrative_choices: { 1: 'A', 2: 'A', 3: 'A' }
			};

			const answersB: UserQuizAnswers = {
				narrative_choices: { 1: 'B', 2: 'B', 3: 'B' }
			};

			const profileA = calculateUserIdeology(answersA);
			const profileB = calculateUserIdeology(answersB);

			// Profiles should be different
			expect(profileA.axis_scores['market-state']).not.toBe(
				profileB.axis_scores['market-state']
			);
			expect(profileA.axis_scores['ecology-economy']).not.toBe(
				profileB.axis_scores['ecology-economy']
			);
		});
	});

	describe('Mock narrative questions validation', () => {
		it('should have valid mock questions for testing', () => {
			expect(mockNarrativeQuestions.length).toBeGreaterThan(0);

			mockNarrativeQuestions.forEach((question) => {
				expect(question).toHaveProperty('id');
				expect(question).toHaveProperty('question');
				expect(question).toHaveProperty('optionA');
				expect(question).toHaveProperty('optionB');

				expect(question.optionA).toHaveProperty('impacts');
				expect(question.optionB).toHaveProperty('impacts');

				expect(Array.isArray(question.optionA.impacts)).toBe(true);
				expect(Array.isArray(question.optionB.impacts)).toBe(true);
			});
		});

		it('should have impacts with valid axis_ids', () => {
			const validAxisIds = ideologicalAxes.map((axis) => axis.id);

			mockNarrativeQuestions.forEach((question) => {
				question.optionA.impacts.forEach((impact) => {
					expect(validAxisIds).toContain(impact.axis_id);
					expect(typeof impact.delta).toBe('number');
				});

				question.optionB.impacts.forEach((impact) => {
					expect(validAxisIds).toContain(impact.axis_id);
					expect(typeof impact.delta).toBe('number');
				});
			});
		});
	});
});
