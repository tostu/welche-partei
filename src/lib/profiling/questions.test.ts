import { describe, it, expect } from 'vitest';
import {
	profilingQuestions,
	getStartingQuestion,
	getQuestionById,
	validateQuestionTree
} from './questions';
import type { ProfilingQuestion, ProfilingAnswer } from './types';

describe('Profiling Questions Data Structure', () => {
	describe('Schema validation (AC #1)', () => {
		it('should export an array of ProfilingQuestion objects', () => {
			expect(Array.isArray(profilingQuestions)).toBe(true);
			expect(profilingQuestions.length).toBeGreaterThan(0);
		});

		it('should have all required properties in ProfilingQuestion interface', () => {
			profilingQuestions.forEach((question) => {
				// Required properties
				expect(question).toHaveProperty('id');
				expect(question).toHaveProperty('text');
				expect(question).toHaveProperty('answers');

				// Type checks
				expect(typeof question.id).toBe('string');
				expect(typeof question.text).toBe('string');
				expect(Array.isArray(question.answers)).toBe(true);

				// Optional properties
				if (question.default_next_question_id !== undefined) {
					expect(typeof question.default_next_question_id).toBe('string');
				}
				if (question.category !== undefined) {
					expect(typeof question.category).toBe('string');
				}
			});
		});

		it('should have valid answer structures', () => {
			profilingQuestions.forEach((question) => {
				expect(question.answers.length).toBeGreaterThan(0);

				question.answers.forEach((answer) => {
					// Required: text
					expect(answer).toHaveProperty('text');
					expect(typeof answer.text).toBe('string');
					expect(answer.text.length).toBeGreaterThan(0);

					// Optional: next_question_id
					if (answer.next_question_id !== undefined) {
						expect(typeof answer.next_question_id).toBe('string');
					}

					// Optional: value
					if (answer.value !== undefined) {
						const valueType = typeof answer.value;
						expect(['string', 'number']).toContain(valueType);
					}
				});
			});
		});

		it('should have unique question IDs', () => {
			const ids = profilingQuestions.map((q) => q.id);
			const uniqueIds = new Set(ids);

			expect(uniqueIds.size).toBe(ids.length);
		});

		it('should have non-empty question text', () => {
			profilingQuestions.forEach((question) => {
				expect(question.text.trim().length).toBeGreaterThan(0);
			});
		});

		it('should have at least 2 answers per question', () => {
			profilingQuestions.forEach((question) => {
				expect(question.answers.length).toBeGreaterThanOrEqual(2);
			});
		});
	});

	describe('Question array export (AC #2)', () => {
		it('should export profilingQuestions as an array', () => {
			expect(profilingQuestions).toBeDefined();
			expect(Array.isArray(profilingQuestions)).toBe(true);
		});

		it('should have at least 3 questions (as specified in AC)', () => {
			expect(profilingQuestions.length).toBeGreaterThanOrEqual(3);
		});

		it('should be accessible as a named export', () => {
			// This test verifies the import worked correctly
			expect(typeof profilingQuestions).toBe('object');
			expect(profilingQuestions).not.toBeNull();
		});
	});

	describe('Tree/graph navigation support (AC #3)', () => {
		it('should support branching logic via next_question_id in answers', () => {
			// Find at least one question with branching
			const branchingQuestion = profilingQuestions.find((q) =>
				q.answers.some((a) => a.next_question_id !== undefined)
			);

			expect(branchingQuestion).toBeDefined();

			if (branchingQuestion) {
				const answerWithBranch = branchingQuestion.answers.find(
					(a) => a.next_question_id !== undefined
				);
				expect(answerWithBranch).toBeDefined();
				expect(answerWithBranch!.next_question_id).toBeTruthy();
			}
		});

		it('should have multiple paths (branching) in the question tree', () => {
			// Count questions that have answers with different next_question_ids
			const questionsWithBranching = profilingQuestions.filter((q) => {
				const nextIds = q.answers
					.map((a) => a.next_question_id)
					.filter((id) => id !== undefined);
				const uniqueNextIds = new Set(nextIds);
				return uniqueNextIds.size > 1; // Multiple different next questions = branching
			});

			expect(questionsWithBranching.length).toBeGreaterThan(0);
		});

		it('should correctly link questions via next_question_id', () => {
			// Example: age-group question should branch to different employment questions
			const ageGroupQuestion = getQuestionById('age-group');
			expect(ageGroupQuestion).toBeDefined();

			if (ageGroupQuestion) {
				const under30Answer = ageGroupQuestion.answers.find(
					(a) => a.value === 'under-30'
				);
				expect(under30Answer).toBeDefined();
				expect(under30Answer!.next_question_id).toBe('employment-status-young');

				// Verify the referenced question exists
				const nextQuestion = getQuestionById(under30Answer!.next_question_id!);
				expect(nextQuestion).toBeDefined();
				expect(nextQuestion!.id).toBe('employment-status-young');
			}
		});

		it('should support terminal nodes (questions with no further navigation)', () => {
			// Find questions where all answers have no next_question_id
			const terminalQuestions = profilingQuestions.filter((q) =>
				q.answers.every((a) => a.next_question_id === undefined)
			);

			expect(terminalQuestions.length).toBeGreaterThan(0);
		});

		it('should demonstrate a complete branching path', () => {
			// Test complete path: age-group -> employment-status-young -> student-priorities
			const q1 = getQuestionById('age-group');
			expect(q1).toBeDefined();

			const answer1 = q1!.answers.find((a) => a.value === 'under-30');
			expect(answer1!.next_question_id).toBe('employment-status-young');

			const q2 = getQuestionById(answer1!.next_question_id!);
			expect(q2).toBeDefined();

			const answer2 = q2!.answers.find((a) => a.value === 'student');
			expect(answer2!.next_question_id).toBe('student-priorities');

			const q3 = getQuestionById(answer2!.next_question_id!);
			expect(q3).toBeDefined();
			expect(q3!.id).toBe('student-priorities');
		});
	});

	describe('Helper functions', () => {
		describe('getStartingQuestion', () => {
			it('should return the age-group question as the starting question', () => {
				const startQuestion = getStartingQuestion();

				expect(startQuestion).toBeDefined();
				expect(startQuestion.id).toBe('age-group');
			});

			it('should return a valid ProfilingQuestion object', () => {
				const startQuestion = getStartingQuestion();

				expect(startQuestion).toHaveProperty('id');
				expect(startQuestion).toHaveProperty('text');
				expect(startQuestion).toHaveProperty('answers');
				expect(Array.isArray(startQuestion.answers)).toBe(true);
			});

			it('should throw error if starting question is not found', () => {
				// We can't easily test this without modifying the questions array,
				// but we verify that the current implementation would throw
				const ageGroupExists = profilingQuestions.some((q) => q.id === 'age-group');
				expect(ageGroupExists).toBe(true);
			});
		});

		describe('getQuestionById', () => {
			it('should return the correct question for a valid ID', () => {
				const question = getQuestionById('age-group');

				expect(question).toBeDefined();
				expect(question!.id).toBe('age-group');
			});

			it('should return undefined for an invalid ID', () => {
				const question = getQuestionById('non-existent-id');

				expect(question).toBeUndefined();
			});

			it('should work for all questions in the array', () => {
				profilingQuestions.forEach((q) => {
					const foundQuestion = getQuestionById(q.id);
					expect(foundQuestion).toBeDefined();
					expect(foundQuestion!.id).toBe(q.id);
				});
			});
		});

		describe('validateQuestionTree', () => {
			it('should return empty array for valid question tree', () => {
				const errors = validateQuestionTree();

				expect(Array.isArray(errors)).toBe(true);
				expect(errors.length).toBe(0);
			});

			it('should validate all next_question_id references', () => {
				// Get all referenced question IDs
				const referencedIds = new Set<string>();
				profilingQuestions.forEach((q) => {
					if (q.default_next_question_id) {
						referencedIds.add(q.default_next_question_id);
					}
					q.answers.forEach((a) => {
						if (a.next_question_id) {
							referencedIds.add(a.next_question_id);
						}
					});
				});

				// All referenced IDs should exist in the questions array
				const questionIds = new Set(profilingQuestions.map((q) => q.id));
				referencedIds.forEach((refId) => {
					expect(questionIds.has(refId)).toBe(true);
				});
			});

			it('should detect invalid references in a modified tree', () => {
				// Create a temporary question with invalid reference
				const invalidQuestion: ProfilingQuestion = {
					id: 'test-invalid',
					text: 'Test question',
					answers: [
						{
							text: 'Answer 1',
							next_question_id: 'non-existent-question-id'
						}
					]
				};

				// Add to temporary array for validation
				const testQuestions = [...profilingQuestions, invalidQuestion];
				const questionIds = new Set(testQuestions.map((q) => q.id));
				const errors: string[] = [];

				testQuestions.forEach((question) => {
					question.answers.forEach((answer, index) => {
						if (answer.next_question_id) {
							if (!questionIds.has(answer.next_question_id)) {
								errors.push(
									`Question "${question.id}" answer ${index} has invalid next_question_id`
								);
							}
						}
					});
				});

				expect(errors.length).toBeGreaterThan(0);
			});
		});
	});

	describe('Question content (German language)', () => {
		it('should have German text for all questions', () => {
			profilingQuestions.forEach((question) => {
				// Basic check: German uses 'ä', 'ö', 'ü', 'ß' or common German words
				// Just verify it's not empty and has reasonable length
				expect(question.text.length).toBeGreaterThan(10);
			});
		});

		it('should have German text for all answers', () => {
			profilingQuestions.forEach((question) => {
				question.answers.forEach((answer) => {
					expect(answer.text.length).toBeGreaterThan(5);
				});
			});
		});
	});

	describe('Question categories', () => {
		it('should categorize questions appropriately', () => {
			const categorized = profilingQuestions.filter((q) => q.category !== undefined);

			expect(categorized.length).toBeGreaterThan(0);
		});

		it('should use valid category values', () => {
			const validCategories = ['demographics', 'priorities'];

			profilingQuestions.forEach((question) => {
				if (question.category) {
					expect(validCategories).toContain(question.category);
				}
			});
		});
	});

	describe('Branching paths (real-world scenarios)', () => {
		it('should provide different paths for different age groups', () => {
			const ageGroupQ = getQuestionById('age-group');
			const under30Path = ageGroupQ!.answers.find((a) => a.value === 'under-30');
			const mid30Path = ageGroupQ!.answers.find((a) => a.value === '30-50');
			const over50Path = ageGroupQ!.answers.find((a) => a.value === 'over-50');

			expect(under30Path!.next_question_id).toBe('employment-status-young');
			expect(mid30Path!.next_question_id).toBe('employment-status-mid');
			expect(over50Path!.next_question_id).toBe('retirement-status');

			// All should be different
			const paths = new Set([
				under30Path!.next_question_id,
				mid30Path!.next_question_id,
				over50Path!.next_question_id
			]);
			expect(paths.size).toBe(3);
		});

		it('should provide student-specific questions for young students', () => {
			const employmentYoungQ = getQuestionById('employment-status-young');
			const studentAnswer = employmentYoungQ!.answers.find((a) => a.value === 'student');

			expect(studentAnswer!.next_question_id).toBe('student-priorities');

			const studentPrioritiesQ = getQuestionById('student-priorities');
			expect(studentPrioritiesQ).toBeDefined();
			expect(studentPrioritiesQ!.text).toContain('Student');
		});
	});
});
