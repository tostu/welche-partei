import { describe, it, expect } from 'vitest';
import {
	profilingQuestions,
	getStartingQuestion,
	getQuestionById,
	validateQuestionTree
} from './questions';
import type { ProfilingQuestion } from './types';

describe('Profiling Questions Data Structure', () => {
	describe('Schema validation', () => {
		it('should export an array of ProfilingQuestion objects', () => {
			expect(Array.isArray(profilingQuestions)).toBe(true);
			expect(profilingQuestions.length).toBeGreaterThan(0);
		});

		it('should have required properties and matching fields depending on type', () => {
			profilingQuestions.forEach((question) => {
				expect(question).toHaveProperty('id');
				expect(question).toHaveProperty('text');
				expect(question).toHaveProperty('type');

				expect(typeof question.id).toBe('string');
				expect(typeof question.text).toBe('string');
				expect(typeof question.type).toBe('string');

				if (question.type === 'multiple_choice') {
					expect(question).toHaveProperty('answers');
					expect(Array.isArray(question.answers)).toBe(true);
					expect(question.answers!.length).toBeGreaterThan(0);

					question.answers!.forEach((answer) => {
						expect(answer).toHaveProperty('text');
						expect(typeof answer.text).toBe('string');
						if (answer.next_question_id !== undefined) {
							expect(typeof answer.next_question_id).toBe('string');
						}
					});
				} else if (question.type === 'budget_allocation') {
					expect(question).toHaveProperty('max_points');
					expect(question).toHaveProperty('options');
					expect(typeof question.max_points).toBe('number');
					expect(Array.isArray(question.options)).toBe(true);
					expect(question.options!.length).toBeGreaterThan(0);

					question.options!.forEach((opt) => {
						expect(opt).toHaveProperty('id');
						expect(opt).toHaveProperty('text');
					});
				} else if (question.type === 'slider') {
					expect(question).toHaveProperty('min_label');
					expect(question).toHaveProperty('max_label');
					expect(typeof question.min_label).toBe('string');
					expect(typeof question.max_label).toBe('string');
				}
			});
		});

		it('should have unique question IDs', () => {
			const ids = profilingQuestions.map((q) => q.id);
			const uniqueIds = new Set(ids);
			expect(uniqueIds.size).toBe(ids.length);
		});
	});

	describe('Tree navigation and helpers', () => {
		it('should return the starting question (age-group)', () => {
			const startQ = getStartingQuestion();
			expect(startQ).toBeDefined();
			expect(startQ.id).toBe('age-group');
		});

		it('should validate tree links cleanly', () => {
			const errors = validateQuestionTree();
			expect(errors).toEqual([]);
		});
	});
});
