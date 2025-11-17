import type { UserQuizAnswers, UserIdeologicalProfile, NarrativeAnswerImpact } from './types';
import { ideologicalAxes } from './ideologicalAxes';

/**
 * Narrative Question Structure (Mock for Epic 2 dependency)
 *
 * This interface represents the expected structure of narrative questions from Epic 2.
 * Once Epic 2 is implemented, this should be imported from the actual narrative questions module.
 */
interface NarrativeQuestion {
	id: number;
	question: string;
	optionA: {
		text: string;
		impacts: NarrativeAnswerImpact[];
	};
	optionB: {
		text: string;
		impacts: NarrativeAnswerImpact[];
	};
}

/**
 * Mock Narrative Questions (Placeholder for Epic 2)
 *
 * These mock questions allow the calculation logic to be implemented and tested
 * before the full narrative question bank is created in Epic 2.
 *
 * Each question presents two options with different ideological impacts.
 */
export const mockNarrativeQuestions: NarrativeQuestion[] = [
	{
		id: 1,
		question: 'How should the economy be regulated?',
		optionA: {
			text: 'Free market with minimal government intervention',
			impacts: [
				{ axis_id: 'market-state', delta: -2 }, // Toward free market
				{ axis_id: 'individual-collective', delta: -1 } // Toward individual
			]
		},
		optionB: {
			text: 'Strong government regulation and oversight',
			impacts: [
				{ axis_id: 'market-state', delta: 2 }, // Toward state control
				{ axis_id: 'individual-collective', delta: 1 } // Toward collective
			]
		}
	},
	{
		id: 2,
		question: 'What should be the priority for environmental policy?',
		optionA: {
			text: 'Economic growth, even if it impacts the environment',
			impacts: [
				{ axis_id: 'ecology-economy', delta: -2 } // Toward economy first
			]
		},
		optionB: {
			text: 'Environmental protection, even at the cost of economic growth',
			impacts: [
				{ axis_id: 'ecology-economy', delta: 2 } // Toward ecology first
			]
		}
	},
	{
		id: 3,
		question: 'How should social values evolve?',
		optionA: {
			text: 'Embrace progressive change and new social norms',
			impacts: [
				{ axis_id: 'progressive-conservative', delta: -2 } // Toward progressive
			]
		},
		optionB: {
			text: 'Preserve traditional values and customs',
			impacts: [
				{ axis_id: 'progressive-conservative', delta: 2 } // Toward conservative
			]
		}
	}
];

/**
 * Clamp Utility Function
 *
 * Ensures a value stays within specified minimum and maximum bounds.
 *
 * @param value - The value to clamp
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @returns Clamped value
 */
function clamp(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, value));
}

/**
 * Calculate User Ideological Profile
 *
 * Calculates a user's ideological profile from their narrative quiz answers.
 * The algorithm:
 * 1. Initializes all axes at their neutral midpoint
 * 2. Applies deltas from selected quiz answers
 * 3. Clamps final scores to valid axis ranges (1-10)
 *
 * @param quizAnswers - User's quiz responses (question_id -> 'A' or 'B')
 * @param narrativeQuestions - Optional narrative questions (defaults to mock)
 * @returns UserIdeologicalProfile with calculated axis scores
 *
 * @example
 * ```typescript
 * const answers: UserQuizAnswers = {
 *   narrative_choices: { 1: 'A', 2: 'B', 3: 'A' }
 * };
 * const profile = calculateUserIdeology(answers);
 * // profile.axis_scores = { 'market-state': 3.5, 'ecology-economy': 7.5, ... }
 * ```
 */
export function calculateUserIdeology(
	quizAnswers: UserQuizAnswers,
	narrativeQuestions: NarrativeQuestion[] = mockNarrativeQuestions
): UserIdeologicalProfile {
	// Step 1: Initialize all axes at neutral midpoint
	const axis_scores: Record<string, number> = {};

	ideologicalAxes.forEach((axis) => {
		const midpoint = (axis.min_value + axis.max_value) / 2;
		axis_scores[axis.id] = midpoint;
	});

	// Step 2: Apply deltas from quiz answers
	Object.entries(quizAnswers.narrative_choices).forEach(([questionIdStr, choice]) => {
		const questionId = Number(questionIdStr);
		const question = narrativeQuestions.find((q) => q.id === questionId);

		// Graceful degradation: skip if question not found
		if (!question) {
			console.warn(`Narrative question ${questionId} not found, skipping`);
			return;
		}

		// Get impacts from selected option
		const selectedOption = choice === 'A' ? question.optionA : question.optionB;

		// Apply each impact
		selectedOption.impacts.forEach((impact) => {
			if (axis_scores[impact.axis_id] !== undefined) {
				axis_scores[impact.axis_id] += impact.delta;
			} else {
				console.warn(`Axis ${impact.axis_id} not found in ideological axes, skipping impact`);
			}
		});
	});

	// Step 3: Clamp all scores to valid ranges
	ideologicalAxes.forEach((axis) => {
		if (axis_scores[axis.id] !== undefined) {
			axis_scores[axis.id] = clamp(axis_scores[axis.id], axis.min_value, axis.max_value);
		}
	});

	// Return user profile
	return {
		axis_scores
	};
}
