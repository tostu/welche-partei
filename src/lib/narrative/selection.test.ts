import { describe, it, expect } from 'vitest';
import { selectNarrativeQuestions } from './selection';
import type { UserProfile } from '$lib/profiling/types';
import { narrativeQuestions } from './questions';

describe('Dynamic Narrative Question Selection', () => {
	describe('selectNarrativeQuestions function', () => {
		it('should export the selectNarrativeQuestions function', () => {
			expect(selectNarrativeQuestions).toBeDefined();
			expect(typeof selectNarrativeQuestions).toBe('function');
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
				expect(question).toHaveProperty('tags');
			});
		});

		it('should return 7-8 questions by default', () => {
			const profile: UserProfile = {};
			const result = selectNarrativeQuestions(profile);
			expect(result.length).toBeGreaterThanOrEqual(7);
			expect(result.length).toBeLessThanOrEqual(8);
		});
	});

	describe('Tag matching quality', () => {
		it('should prioritize questions matching student path', () => {
			const studentProfile: UserProfile = {
				'age-group': 'under-30',
				'employment-status-young': 'student',
				'student-priorities': {
					'focus-career': 1,
					'focus-lifestyle': 3,
					'focus-independence': 1
				}
			};

			const result = selectNarrativeQuestions(studentProfile);
			const hasStudentTags = result.some((q) =>
				q.tags.some((tag) =>
					['student', 'lifestyle', 'mental-health'].includes(tag)
				)
			);
			expect(hasStudentTags).toBe(true);
		});

		it('should prioritize questions matching worker slider path', () => {
			const workerProfile: UserProfile = {
				'age-group': 'under-30',
				'employment-status-young': 'employed',
				'young-worker-priorities': 10 // low slider value -> work-culture, economy
			};

			const result = selectNarrativeQuestions(workerProfile);
			const hasWorkerTags = result.some((q) =>
				q.tags.some((tag) =>
					['work-culture', 'economy', 'employment'].includes(tag)
				)
			);
			expect(hasWorkerTags).toBe(true);
		});
	});
});
