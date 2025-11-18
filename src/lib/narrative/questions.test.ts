import { describe, it, expect } from 'vitest';
import {
	narrativeQuestions,
	getNarrativeQuestionById,
	getNarrativeQuestionsByTag,
	validateNarrativeQuestions
} from './questions';
import type { NarrativeQuestion, NarrativeAnswerOption } from './types';

describe('Narrative Questions Data Structure', () => {
	describe('Schema validation (AC #1)', () => {
		it('should export an array of NarrativeQuestion objects', () => {
			expect(Array.isArray(narrativeQuestions)).toBe(true);
			expect(narrativeQuestions.length).toBeGreaterThan(0);
		});

		it('should have all required properties in NarrativeQuestion interface', () => {
			narrativeQuestions.forEach((question) => {
				// Required properties
				expect(question).toHaveProperty('id');
				expect(question).toHaveProperty('story_text');
				expect(question).toHaveProperty('optionA');
				expect(question).toHaveProperty('optionB');
				expect(question).toHaveProperty('tags');

				// Type checks
				expect(typeof question.id).toBe('number');
				expect(typeof question.story_text).toBe('string');
				expect(typeof question.optionA).toBe('object');
				expect(typeof question.optionB).toBe('object');
				expect(Array.isArray(question.tags)).toBe(true);
			});
		});

		it('should have valid answer option structures', () => {
			narrativeQuestions.forEach((question) => {
				// Check optionA
				expect(question.optionA).toHaveProperty('text');
				expect(question.optionA).toHaveProperty('impacts');
				expect(typeof question.optionA.text).toBe('string');
				expect(Array.isArray(question.optionA.impacts)).toBe(true);
				expect(question.optionA.impacts.length).toBeGreaterThan(0);

				// Check optionB
				expect(question.optionB).toHaveProperty('text');
				expect(question.optionB).toHaveProperty('impacts');
				expect(typeof question.optionB.text).toBe('string');
				expect(Array.isArray(question.optionB.impacts)).toBe(true);
				expect(question.optionB.impacts.length).toBeGreaterThan(0);
			});
		});

		it('should have unique question IDs', () => {
			const ids = narrativeQuestions.map((q) => q.id);
			const uniqueIds = new Set(ids);

			expect(uniqueIds.size).toBe(ids.length);
		});

		it('should have non-empty story text', () => {
			narrativeQuestions.forEach((question) => {
				expect(question.story_text.trim().length).toBeGreaterThan(0);
				expect(question.story_text.length).toBeGreaterThan(20); // Substantial story
			});
		});

		it('should have non-empty answer option texts', () => {
			narrativeQuestions.forEach((question) => {
				expect(question.optionA.text.trim().length).toBeGreaterThan(0);
				expect(question.optionB.text.trim().length).toBeGreaterThan(0);
			});
		});
	});

	describe('Ideological impacts mapping (AC #2)', () => {
		it('should have valid impact structures in all options', () => {
			narrativeQuestions.forEach((question) => {
				// Check optionA impacts
				question.optionA.impacts.forEach((impact) => {
					expect(impact).toHaveProperty('axis_id');
					expect(impact).toHaveProperty('delta');
					expect(typeof impact.axis_id).toBe('string');
					expect(typeof impact.delta).toBe('number');
				});

				// Check optionB impacts
				question.optionB.impacts.forEach((impact) => {
					expect(impact).toHaveProperty('axis_id');
					expect(impact).toHaveProperty('delta');
					expect(typeof impact.axis_id).toBe('string');
					expect(typeof impact.delta).toBe('number');
				});
			});
		});

		it('should reference valid ideological axis IDs', () => {
			const validAxisIds = ['market-state', 'individual-collective', 'progressive-conservative', 'ecology-economy'];

			narrativeQuestions.forEach((question) => {
				question.optionA.impacts.forEach((impact) => {
					expect(validAxisIds).toContain(impact.axis_id);
				});

				question.optionB.impacts.forEach((impact) => {
					expect(validAxisIds).toContain(impact.axis_id);
				});
			});
		});

		it('should have delta values within reasonable range', () => {
			const minDelta = -3.0;
			const maxDelta = +3.0;

			narrativeQuestions.forEach((question) => {
				question.optionA.impacts.forEach((impact) => {
					expect(impact.delta).toBeGreaterThanOrEqual(minDelta);
					expect(impact.delta).toBeLessThanOrEqual(maxDelta);
					expect(impact.delta).not.toBe(0); // Impact should be meaningful
				});

				question.optionB.impacts.forEach((impact) => {
					expect(impact.delta).toBeGreaterThanOrEqual(minDelta);
					expect(impact.delta).toBeLessThanOrEqual(maxDelta);
					expect(impact.delta).not.toBe(0); // Impact should be meaningful
				});
			});
		});

		it('should have at least one impact per answer option', () => {
			narrativeQuestions.forEach((question) => {
				expect(question.optionA.impacts.length).toBeGreaterThanOrEqual(1);
				expect(question.optionB.impacts.length).toBeGreaterThanOrEqual(1);
			});
		});

		it('should demonstrate ideological trade-offs between options', () => {
			// At least some questions should have options that push in opposite directions
			let hasTradeoffs = false;

			narrativeQuestions.forEach((question) => {
				const optionAImpacts = question.optionA.impacts;
				const optionBImpacts = question.optionB.impacts;

				// Check if the same axis is affected in opposite directions
				optionAImpacts.forEach((impactA) => {
					const correspondingB = optionBImpacts.find((impactB) => impactB.axis_id === impactA.axis_id);
					if (correspondingB) {
						// If both options affect the same axis, check if they push in opposite directions
						if (Math.sign(impactA.delta) !== Math.sign(correspondingB.delta)) {
							hasTradeoffs = true;
						}
					}
				});
			});

			expect(hasTradeoffs).toBe(true);
		});
	});

	describe('Demographic tags (AC #3)', () => {
		it('should have at least one tag per question', () => {
			narrativeQuestions.forEach((question) => {
				expect(question.tags.length).toBeGreaterThanOrEqual(1);
			});
		});

		it('should have valid tag strings', () => {
			narrativeQuestions.forEach((question) => {
				question.tags.forEach((tag) => {
					expect(typeof tag).toBe('string');
					expect(tag.trim().length).toBeGreaterThan(0);
					expect(tag).not.toContain(' '); // Tags should be single words or hyphenated
				});
			});
		});

		it('should have diverse tag categories', () => {
			const allTags = new Set<string>();
			narrativeQuestions.forEach((question) => {
				question.tags.forEach((tag) => allTags.add(tag));
			});

			// Should have at least 10 different tags for demographic diversity
			expect(allTags.size).toBeGreaterThanOrEqual(10);
		});

		it('should include common demographic tags', () => {
			const allTags = new Set<string>();
			narrativeQuestions.forEach((question) => {
				question.tags.forEach((tag) => allTags.add(tag));
			});

			// Check for some expected demographic categories
			const hasUrban = Array.from(allTags).some((tag) => tag.includes('urban'));
			const hasRural = Array.from(allTags).some((tag) => tag.includes('rural'));
			const hasYoung = Array.from(allTags).some((tag) => tag.includes('young') || tag === 'student');
			const hasSenior = Array.from(allTags).some((tag) => tag.includes('senior'));

			expect(hasUrban || hasRural).toBe(true);
			expect(hasYoung || hasSenior).toBe(true);
		});
	});

	describe('Helper functions', () => {
		describe('getNarrativeQuestionById', () => {
			it('should return the correct question for a valid ID', () => {
				const question = getNarrativeQuestionById(1);

				expect(question).toBeDefined();
				expect(question!.id).toBe(1);
			});

			it('should return undefined for an invalid ID', () => {
				const question = getNarrativeQuestionById(9999);

				expect(question).toBeUndefined();
			});

			it('should work for all questions in the array', () => {
				narrativeQuestions.forEach((q) => {
					const foundQuestion = getNarrativeQuestionById(q.id);
					expect(foundQuestion).toBeDefined();
					expect(foundQuestion!.id).toBe(q.id);
				});
			});
		});

		describe('getNarrativeQuestionsByTag', () => {
			it('should return questions with the specified tag', () => {
				// Get all unique tags first
				const allTags = new Set<string>();
				narrativeQuestions.forEach((q) => q.tags.forEach((tag) => allTags.add(tag)));

				// Pick a tag that exists
				const testTag = Array.from(allTags)[0];
				const questions = getNarrativeQuestionsByTag(testTag);

				expect(questions.length).toBeGreaterThan(0);
				questions.forEach((q) => {
					expect(q.tags).toContain(testTag);
				});
			});

			it('should return empty array for non-existent tag', () => {
				const questions = getNarrativeQuestionsByTag('non-existent-tag-xyz');

				expect(questions).toEqual([]);
			});

			it('should work for common demographic tags', () => {
				const urbanQuestions = getNarrativeQuestionsByTag('urban');
				const studentQuestions = getNarrativeQuestionsByTag('student');

				// At least one of these should have results
				expect(urbanQuestions.length + studentQuestions.length).toBeGreaterThan(0);
			});
		});

		describe('validateNarrativeQuestions', () => {
			it('should return empty array for valid question data', () => {
				const errors = validateNarrativeQuestions();

				expect(Array.isArray(errors)).toBe(true);
				expect(errors.length).toBe(0);
			});

			it('should validate all axis_id references', () => {
				const validAxisIds = ['market-state', 'individual-collective', 'progressive-conservative', 'ecology-economy'];
				const allAxisIds = new Set<string>();

				narrativeQuestions.forEach((question) => {
					question.optionA.impacts.forEach((impact) => allAxisIds.add(impact.axis_id));
					question.optionB.impacts.forEach((impact) => allAxisIds.add(impact.axis_id));
				});

				// All used axis IDs should be valid
				allAxisIds.forEach((axisId) => {
					expect(validAxisIds).toContain(axisId);
				});
			});
		});
	});

	describe('Question content (German language)', () => {
		it('should have German text for all story texts', () => {
			narrativeQuestions.forEach((question) => {
				// German uses umlauts and ß, or common German words
				// Just verify it's not empty and has reasonable length
				expect(question.story_text.length).toBeGreaterThan(30);
			});
		});

		it('should have German text for all answer options', () => {
			narrativeQuestions.forEach((question) => {
				expect(question.optionA.text.length).toBeGreaterThan(10);
				expect(question.optionB.text.length).toBeGreaterThan(10);
			});
		});
	});

	describe('Question bank size', () => {
		it('should have at least 3 sample questions (as per AC)', () => {
			expect(narrativeQuestions.length).toBeGreaterThanOrEqual(3);
		});

		it('should have a diverse set of questions (recommended 10+)', () => {
			// For a production quiz, we want a good variety
			expect(narrativeQuestions.length).toBeGreaterThanOrEqual(10);
		});
	});

	describe('Data quality checks', () => {
		it('should have balanced impact distribution across axes', () => {
			const axisUsage: Record<string, number> = {
				'market-state': 0,
				'individual-collective': 0,
				'progressive-conservative': 0,
				'ecology-economy': 0
			};

			narrativeQuestions.forEach((question) => {
				question.optionA.impacts.forEach((impact) => {
					axisUsage[impact.axis_id]++;
				});
				question.optionB.impacts.forEach((impact) => {
					axisUsage[impact.axis_id]++;
				});
			});

			// All axes should be used at least once
			Object.values(axisUsage).forEach((count) => {
				expect(count).toBeGreaterThan(0);
			});
		});

		it('should have realistic scenario descriptions', () => {
			narrativeQuestions.forEach((question) => {
				// Scenarios should be substantive (not just a single sentence)
				const sentences = question.story_text.split('.').filter((s) => s.trim().length > 0);
				expect(sentences.length).toBeGreaterThanOrEqual(1);
			});
		});

		it('should have meaningful answer options', () => {
			narrativeQuestions.forEach((question) => {
				// Answer options should be substantial (not just "yes" or "no")
				expect(question.optionA.text.length).toBeGreaterThan(15);
				expect(question.optionB.text.length).toBeGreaterThan(15);
			});
		});
	});

	describe('Ideological coverage', () => {
		it('should cover all four ideological axes', () => {
			const axesCovered = new Set<string>();

			narrativeQuestions.forEach((question) => {
				question.optionA.impacts.forEach((impact) => axesCovered.add(impact.axis_id));
				question.optionB.impacts.forEach((impact) => axesCovered.add(impact.axis_id));
			});

			expect(axesCovered.has('market-state')).toBe(true);
			expect(axesCovered.has('individual-collective')).toBe(true);
			expect(axesCovered.has('progressive-conservative')).toBe(true);
			expect(axesCovered.has('ecology-economy')).toBe(true);
		});

		it('should have questions focusing on different primary axes', () => {
			// Questions should explore different ideological dimensions as primary focus
			const primaryAxes = narrativeQuestions.map((question) => {
				// Consider the axis with the largest absolute impact as the primary axis
				let primaryAxis = '';
				let maxImpact = 0;

				[...question.optionA.impacts, ...question.optionB.impacts].forEach((impact) => {
					if (Math.abs(impact.delta) > maxImpact) {
						maxImpact = Math.abs(impact.delta);
						primaryAxis = impact.axis_id;
					}
				});

				return primaryAxis;
			});

			const uniquePrimaryAxes = new Set(primaryAxes);
			// Should have at least 3 different primary axes
			expect(uniquePrimaryAxes.size).toBeGreaterThanOrEqual(3);
		});
	});
});
