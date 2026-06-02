import { describe, it, expect } from 'vitest';
import {
	narrativeQuestions,
	getNarrativeQuestionById,
	getNarrativeQuestionsByTag,
	validateNarrativeQuestions
} from './questions';

describe('Narrative Questions Data Structure', () => {
	describe('Schema validation', () => {
		it('should export an array of NarrativeQuestion objects', () => {
			expect(Array.isArray(narrativeQuestions)).toBe(true);
			expect(narrativeQuestions.length).toBeGreaterThan(0);
		});

		it('should have required properties in NarrativeQuestion interface based on type', () => {
			narrativeQuestions.forEach((question) => {
				expect(question).toHaveProperty('id');
				expect(question).toHaveProperty('story_text');
				expect(question).toHaveProperty('type');
				expect(question).toHaveProperty('tags');

				expect(typeof question.id).toBe('number');
				expect(typeof question.story_text).toBe('string');
				expect(typeof question.type).toBe('string');
				expect(Array.isArray(question.tags)).toBe(true);

				if (question.type === 'multiple_choice') {
					expect(question).toHaveProperty('answers');
					expect(Array.isArray(question.answers)).toBe(true);
					expect(question.answers!.length).toBeGreaterThan(0);

					question.answers!.forEach((ans) => {
						expect(ans).toHaveProperty('text');
						expect(typeof ans.text).toBe('string');
						expect(Array.isArray(ans.impacts)).toBe(true);
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
					expect(question).toHaveProperty('axis_id');
					expect(typeof question.min_label).toBe('string');
					expect(typeof question.max_label).toBe('string');
					expect(typeof question.axis_id).toBe('string');
				}
			});
		});

		it('should have unique question IDs', () => {
			const ids = narrativeQuestions.map((q) => q.id);
			const uniqueIds = new Set(ids);
			expect(uniqueIds.size).toBe(ids.length);
		});
	});

	describe('Helpers and validation', () => {
		it('should return correct question by ID', () => {
			const q = getNarrativeQuestionById(1);
			expect(q).toBeDefined();
			expect(q!.id).toBe(1);
		});

		it('should filter questions by tag', () => {
			const questions = getNarrativeQuestionsByTag('housing');
			expect(questions.length).toBeGreaterThan(0);
			questions.forEach((q) => {
				expect(q.tags).toContain('housing');
			});
		});

		it('should return empty list of errors for validation', () => {
			const errors = validateNarrativeQuestions();
			expect(errors).toEqual([]);
		});
	});
});
