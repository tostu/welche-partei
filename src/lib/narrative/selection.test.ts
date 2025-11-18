import { describe, it, expect, beforeEach } from 'vitest';
import { selectNarrativeQuestions } from './selection';
import type { UserProfile } from '$lib/profiling/types';
import { narrativeQuestions } from './questions';

describe('Dynamic Narrative Question Selection', () => {
	describe('selectNarrativeQuestions function exists (AC #1)', () => {
		it('should export the selectNarrativeQuestions function', () => {
			expect(selectNarrativeQuestions).toBeDefined();
			expect(typeof selectNarrativeQuestions).toBe('function');
		});

		it('should accept a UserProfile parameter', () => {
			const profile: UserProfile = {};
			const result = selectNarrativeQuestions(profile);

			expect(Array.isArray(result)).toBe(true);
		});

		it('should return an array of NarrativeQuestion objects', () => {
			const profile: UserProfile = {
				'age-group': 'under-30',
				'employment-status-young': 'student'
			};

			const result = selectNarrativeQuestions(profile);

			expect(Array.isArray(result)).toBe(true);
			result.forEach((question) => {
				expect(question).toHaveProperty('id');
				expect(question).toHaveProperty('story_text');
				expect(question).toHaveProperty('optionA');
				expect(question).toHaveProperty('optionB');
				expect(question).toHaveProperty('tags');
			});
		});
	});

	describe('Question prioritization based on tags (AC #2)', () => {
		it('should prioritize questions matching student demographic', () => {
			const studentProfile: UserProfile = {
				'age-group': 'under-30',
				'employment-status-young': 'student',
				'student-priorities': 'housing-bafög'
			};

			const result = selectNarrativeQuestions(studentProfile);

			// Should select some questions tagged with 'student', 'housing', 'urban', 'education', etc.
			const hasStudentTags = result.some((q) => q.tags.some((tag) =>
				['student', 'housing', 'urban', 'education', 'young-professional'].includes(tag)
			));

			expect(hasStudentTags).toBe(true);
		});

		it('should prioritize questions matching senior demographic', () => {
			const seniorProfile: UserProfile = {
				'age-group': 'over-50',
				'retirement-status': 'retired',
				'retirement-priorities': 'healthcare-care'
			};

			const result = selectNarrativeQuestions(seniorProfile);

			// Should select some questions tagged with 'senior', 'retirement', 'healthcare'
			const hasSeniorTags = result.some((q) => q.tags.some((tag) =>
				['senior', 'retirement', 'healthcare', 'pension'].includes(tag)
			));

			expect(hasSeniorTags).toBe(true);
		});

		it('should prioritize questions matching parent demographic', () => {
			const parentProfile: UserProfile = {
				'age-group': '30-50',
				'employment-status-mid': 'employed',
				'working-priorities': 'childcare-family'
			};

			const result = selectNarrativeQuestions(parentProfile);

			// Should select some questions tagged with 'parent', 'family', 'childcare'
			const hasParentTags = result.some((q) => q.tags.some((tag) =>
				['parent', 'family', 'childcare', 'education'].includes(tag)
			));

			expect(hasParentTags).toBe(true);
		});

		it('should prioritize questions matching worker demographic', () => {
			const workerProfile: UserProfile = {
				'age-group': 'under-30',
				'employment-status-young': 'employed',
				'young-worker-priorities': 'fair-wages'
			};

			const result = selectNarrativeQuestions(workerProfile);

			// Should select some questions tagged with 'worker', 'employment', 'labor'
			const hasWorkerTags = result.some((q) => q.tags.some((tag) =>
				['worker', 'employment', 'labor', 'workplace', 'young-worker'].includes(tag)
			));

			expect(hasWorkerTags).toBe(true);
		});
	});

	describe('Return count validation', () => {
		it('should return 7-8 questions by default', () => {
			const profile: UserProfile = {
				'age-group': 'under-30',
				'employment-status-young': 'student'
			};

			const result = selectNarrativeQuestions(profile);

			expect(result.length).toBeGreaterThanOrEqual(7);
			expect(result.length).toBeLessThanOrEqual(8);
		});

		it('should target 8 questions when targetCount parameter is 8', () => {
			const profile: UserProfile = {
				'age-group': '30-50'
			};

			const result = selectNarrativeQuestions(profile, 8);

			// With 12 questions in the bank, should be able to return 8
			expect(result.length).toBe(8);
		});

		it('should return unique questions (no duplicates)', () => {
			const profile: UserProfile = {
				'age-group': 'under-30',
				'employment-status-young': 'student',
				'student-priorities': 'climate-future'
			};

			const result = selectNarrativeQuestions(profile);
			const questionIds = result.map((q) => q.id);
			const uniqueIds = new Set(questionIds);

			expect(uniqueIds.size).toBe(questionIds.length);
		});

		it('should return all available questions if bank has fewer than target', () => {
			const profile: UserProfile = {
				'age-group': 'under-30'
			};

			// Request more questions than available
			const result = selectNarrativeQuestions(profile, 50);

			// Should return all 12 questions from the bank
			expect(result.length).toBe(narrativeQuestions.length);
		});
	});

	describe('Edge cases', () => {
		it('should handle empty UserProfile', () => {
			const emptyProfile: UserProfile = {};

			const result = selectNarrativeQuestions(emptyProfile);

			// Should still return 7-8 questions (random selection)
			expect(result.length).toBeGreaterThanOrEqual(7);
			expect(result.length).toBeLessThanOrEqual(8);
		});

		it('should handle UserProfile with unknown values', () => {
			const unknownProfile: UserProfile = {
				'unknown-question': 'unknown-value',
				'another-unknown': 'also-unknown'
			};

			const result = selectNarrativeQuestions(unknownProfile);

			// Should still return questions (fallback to random selection)
			expect(result.length).toBeGreaterThanOrEqual(7);
			expect(result.length).toBeLessThanOrEqual(8);
		});

		it('should handle UserProfile with partial data', () => {
			const partialProfile: UserProfile = {
				'age-group': 'under-30'
				// Missing employment status and priorities
			};

			const result = selectNarrativeQuestions(partialProfile);

			expect(result.length).toBeGreaterThanOrEqual(7);
			expect(result.length).toBeLessThanOrEqual(8);
		});

		it('should handle UserProfile with numeric values', () => {
			const mixedProfile: UserProfile = {
				'age-group': 'under-30',
				'some-numeric-answer': 25 // Numeric answer
			};

			const result = selectNarrativeQuestions(mixedProfile);

			// Should handle numeric values gracefully (ignore them)
			expect(result.length).toBeGreaterThanOrEqual(7);
			expect(result.length).toBeLessThanOrEqual(8);
		});

		it('should handle UserProfile with undefined values', () => {
			const undefinedProfile: UserProfile = {
				'age-group': 'under-30',
				'optional-question': undefined
			};

			const result = selectNarrativeQuestions(undefinedProfile);

			expect(result.length).toBeGreaterThanOrEqual(7);
			expect(result.length).toBeLessThanOrEqual(8);
		});
	});

	describe('Selection quality', () => {
		it('should include variety of topics even for specific profiles', () => {
			const specificProfile: UserProfile = {
				'age-group': 'under-30',
				'employment-status-young': 'student',
				'student-priorities': 'housing-bafög'
			};

			const result = selectNarrativeQuestions(specificProfile);

			// Collect all unique tags from selected questions
			const allTags = new Set<string>();
			result.forEach((q) => {
				q.tags.forEach((tag) => allTags.add(tag));
			});

			// Should have variety (at least 5 different tags across selected questions)
			expect(allTags.size).toBeGreaterThanOrEqual(5);
		});

		it('should select from all available questions when profile is generic', () => {
			const genericProfile: UserProfile = {
				'age-group': '30-50'
			};

			const result = selectNarrativeQuestions(genericProfile);

			// With a generic profile, questions should come from various topics
			const topicCounts: Record<string, number> = {};
			result.forEach((q) => {
				const firstTag = q.tags[0];
				topicCounts[firstTag] = (topicCounts[firstTag] || 0) + 1;
			});

			// No single topic should dominate (max 50% of questions)
			const maxTopicCount = Math.max(...Object.values(topicCounts));
			expect(maxTopicCount).toBeLessThanOrEqual(result.length * 0.5);
		});
	});

	describe('Consistency and randomization', () => {
		it('should be deterministic for same profile (within test run)', () => {
			const profile: UserProfile = {
				'age-group': 'under-30',
				'employment-status-young': 'student'
			};

			const result1 = selectNarrativeQuestions(profile);
			const result2 = selectNarrativeQuestions(profile);

			// Both should return 7-8 questions
			expect(result1.length).toBeGreaterThanOrEqual(7);
			expect(result2.length).toBeGreaterThanOrEqual(7);

			// Both should prioritize similar demographics
			const tags1 = new Set(result1.flatMap((q) => q.tags));
			const tags2 = new Set(result2.flatMap((q) => q.tags));

			// Should have significant tag overlap (at least 50%)
			const commonTags = [...tags1].filter((tag) => tags2.has(tag));
			const overlapRatio = commonTags.length / Math.min(tags1.size, tags2.size);
			expect(overlapRatio).toBeGreaterThan(0.5);
		});

		it('should provide different questions for different profiles', () => {
			const studentProfile: UserProfile = {
				'age-group': 'under-30',
				'employment-status-young': 'student'
			};

			const seniorProfile: UserProfile = {
				'age-group': 'over-50',
				'retirement-status': 'retired'
			};

			const studentQuestions = selectNarrativeQuestions(studentProfile);
			const seniorQuestions = selectNarrativeQuestions(seniorProfile);

			// Collect tags from each selection
			const studentTags = new Set(studentQuestions.flatMap((q) => q.tags));
			const seniorTags = new Set(seniorQuestions.flatMap((q) => q.tags));

			// Should have some different tags between the two selections
			const studentOnlyTags = [...studentTags].filter((tag) => !seniorTags.has(tag));
			const seniorOnlyTags = [...seniorTags].filter((tag) => !studentTags.has(tag));

			// At least one selection should have unique tags
			expect(studentOnlyTags.length + seniorOnlyTags.length).toBeGreaterThan(0);
		});
	});

	describe('Real-world scenarios', () => {
		it('should work for typical student path', () => {
			const profile: UserProfile = {
				'age-group': 'under-30',
				'employment-status-young': 'student',
				'student-priorities': 'digital-education'
			};

			const result = selectNarrativeQuestions(profile);

			expect(result.length).toBeGreaterThanOrEqual(7);
			expect(result.length).toBeLessThanOrEqual(8);

			// Should include questions relevant to students
			const relevantTags = ['student', 'education', 'digital', 'technology', 'housing', 'young-professional'];
			const hasRelevantQuestions = result.some((q) =>
				q.tags.some((tag) => relevantTags.includes(tag))
			);
			expect(hasRelevantQuestions).toBe(true);
		});

		it('should work for typical mid-career parent path', () => {
			const profile: UserProfile = {
				'age-group': '30-50',
				'employment-status-mid': 'employed',
				'working-priorities': 'childcare-family'
			};

			const result = selectNarrativeQuestions(profile);

			expect(result.length).toBeGreaterThanOrEqual(7);
			expect(result.length).toBeLessThanOrEqual(8);

			// Should include questions relevant to parents and workers
			const relevantTags = ['parent', 'family', 'childcare', 'worker', 'workplace', 'education'];
			const hasRelevantQuestions = result.some((q) =>
				q.tags.some((tag) => relevantTags.includes(tag))
			);
			expect(hasRelevantQuestions).toBe(true);
		});

		it('should work for typical retiree path', () => {
			const profile: UserProfile = {
				'age-group': 'over-50',
				'retirement-status': 'retired',
				'retirement-priorities': 'pension-amount'
			};

			const result = selectNarrativeQuestions(profile);

			expect(result.length).toBeGreaterThanOrEqual(7);
			expect(result.length).toBeLessThanOrEqual(8);

			// Should include questions relevant to retirees
			const relevantTags = ['senior', 'retirement', 'pension', 'healthcare', 'social-security'];
			const hasRelevantQuestions = result.some((q) =>
				q.tags.some((tag) => relevantTags.includes(tag))
			);
			expect(hasRelevantQuestions).toBe(true);
		});
	});
});
