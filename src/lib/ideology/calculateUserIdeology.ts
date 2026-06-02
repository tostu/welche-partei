import type { UserQuizAnswers, UserIdeologicalProfile } from './types';
import type { NarrativeQuestion } from '$lib/narrative/types';
import type { UserProfile } from '$lib/profiling/types';
import { ideologicalAxes } from './ideologicalAxes';
import { narrativeQuestions } from '$lib/narrative/questions';

/**
 * Clamp Utility Function
 *
 * Ensures a value stays within specified minimum and maximum bounds.
 */
function clamp(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, value));
}

/**
 * Demographic axis starting shifts
 * Defines numerical offsets based on demographic profiling answers
 */
const PROFILING_SHIFTS: Record<string, Record<string, number>> = {
	'market-state': {
		// Age groups
		'30-50': -0.2, // slightly towards market
		'over-50': +0.2, // slightly towards state support

		// Employment
		'employed': -0.6, // towards market/individual responsibility
		'self-employed': -1.0, // strong market orientation
		'unemployed': +0.8, // wants state intervention/support
		'retired': +0.4, // wants state/pension stability

		// Priorities
		'housing-bafög': +0.3, // wants state housing support
		'fair-wages': +0.6, // wants wage regulation/state intervention
		'career-advancement': -0.2, // towards market/individual
		'childcare-family': 0.0, // neutral (so employed mid starts at exactly 4.2: 5.0 - 0.2 - 0.6 = 4.2)
		'pension-security': +0.4, // state security
		'taxes-bureaucracy': -0.8, // strong market orientation (lower taxes, less regulation)
		'social-security': +0.8, // strong state support
		'economic-innovation': -0.4, // market-oriented
		'pension-amount': +0.5,
		'healthcare-care': +0.4,
		'retirement-transition': +0.3
	},
	'individual-collective': {
		// Age groups
		'under-30': +0.1,
		'30-50': -0.1,

		// Employment
		'employed': -0.2,
		'self-employed': -0.6,
		'unemployed': +0.4,
		'retired': +0.2,

		// Priorities
		'fair-wages': +0.3,
		'work-life-balance': +0.2,
		'childcare-family': +0.1,
		'pension-security': +0.2,
		'taxes-bureaucracy': -0.4,
		'social-security': +0.6,
		'health-workload': +0.2,
		'family-security': +0.3
	},
	'progressive-conservative': {
		// Age groups
		'under-30': -0.5, // towards progressive
		'over-50': +0.5, // towards conservative

		// Employment
		'student': -1.0, // highly progressive
		'retired': +0.3, // slightly conservative

		// Priorities
		'climate-future': -0.5, // progressive
		'digital-education': -0.3, // progressive
		'childcare-family': -0.2, // progressive
		'grandchildren-environment': -0.4 // progressive
	},
	'ecology-economy': {
		// Age groups
		'under-30': +0.3, // slightly green

		// Priorities
		'climate-future': +1.2, // very green
		'grandchildren-environment': +0.8, // green
		'taxes-bureaucracy': -0.5, // economic-focused
		'economic-innovation': -0.6, // economic-focused
		'career-stability': -0.2
	}
};

/**
 * Calculate the starting shift for an axis based on demographic profiling
 */
function calculateProfilingShift(axisId: string, profile: UserProfile): number {
	let totalShift = 0;

	// Loop over all profiling answers
	Object.entries(profile).forEach(([key, value]) => {
		if (typeof value === 'string') {
			if (PROFILING_SHIFTS[axisId]?.[value] !== undefined) {
				totalShift += PROFILING_SHIFTS[axisId][value];
			}
		} else if (typeof value === 'number') {
			// Slider questions
			if (key === 'young-worker-priorities') {
				if (axisId === 'market-state') {
					totalShift += ((value - 50) / 50) * 0.6; // Left = Market (-0.6), Right = State (+0.6)
				} else if (axisId === 'individual-collective') {
					totalShift += ((value - 50) / 50) * 0.6; // Left = Individual (-0.6), Right = Collective (+0.6)
				}
			} else if (key === 'working-priorities') {
				if (axisId === 'market-state') {
					totalShift += ((50 - value) / 50) * 0.5; // Left = State (+0.5), Right = Market (-0.5)
				} else if (axisId === 'individual-collective') {
					totalShift += ((50 - value) / 50) * 0.5; // Left = Collective (+0.5), Right = Individual (-0.5)
				}
			} else if (key === 'retirement-priorities') {
				if (axisId === 'individual-collective') {
					totalShift += ((value - 50) / 50) * 0.6; // Left = Individual (-0.6), Right = Collective (+0.6)
				} else if (axisId === 'ecology-economy') {
					if (value > 50) {
						totalShift += ((value - 50) / 50) * 0.8; // Right = Ecology (+0.8)
					}
				}
			}
		} else if (value && typeof value === 'object') {
			// Budget allocation questions
			if (key === 'student-priorities') {
				const career = value['focus-career'] || 0;
				const lifestyle = value['focus-lifestyle'] || 0;
				const independence = value['focus-independence'] || 0;

				if (axisId === 'market-state') {
					totalShift += career * -0.15 + lifestyle * 0.15 + independence * -0.2;
				} else if (axisId === 'individual-collective') {
					totalShift += career * -0.15 + lifestyle * 0.15 + independence * -0.1;
				} else if (axisId === 'progressive-conservative') {
					totalShift += lifestyle * -0.2; // lifestyle is progressive
				}
			}
		}
	});

	return totalShift;
}

/**
 * Calculate User Ideological Profile
 *
 * Calculates a user's ideological profile from their narrative quiz answers.
 * The algorithm:
 * 1. Initializes all axes using profiling shifts or at their neutral midpoint
 * 2. Applies deltas from selected quiz answers (Options A, B, and C)
 * 3. Clamps final scores to valid axis ranges (1-10)
 *
 * @param quizAnswers - User's quiz responses (question_id -> 'A', 'B' or 'C')
 * @param questions - Optional narrative questions
 * @param profilingProfile - Optional profiling answers to calculate dynamic start values
 * @returns UserIdeologicalProfile with calculated axis scores
 */
export function calculateUserIdeology(
	quizAnswers: UserQuizAnswers,
	questions: NarrativeQuestion[] = narrativeQuestions,
	profilingProfile?: UserProfile
): UserIdeologicalProfile {
	// Step 1: Initialize all axes with dynamic start values based on profiling
	const axis_scores: Record<string, number> = {};

	ideologicalAxes.forEach((axis) => {
		const midpoint = (axis.min_value + axis.max_value) / 2;
		const shift = profilingProfile ? calculateProfilingShift(axis.id, profilingProfile) : 0;
		axis_scores[axis.id] = midpoint + shift;
	});

	// Step 2: Apply deltas from quiz answers
	Object.entries(quizAnswers.narrative_choices).forEach(([questionIdStr, choice]) => {
		const questionId = Number(questionIdStr);
		const question = questions.find((q) => q.id === questionId);

		// Graceful degradation: skip if question not found
		if (!question) {
			console.warn(`Narrative question ${questionId} not found, skipping`);
			return;
		}

		if (question.optionA || !question.type) {
			// Fallback: old multiple choice format (optionA, optionB, optionC)
			let selectedOption = question.optionA;
			if (choice === 'B') {
				selectedOption = question.optionB;
			} else if (choice === 'C' && question.optionC) {
				selectedOption = question.optionC;
			}

			if (selectedOption && selectedOption.impacts) {
				selectedOption.impacts.forEach((impact) => {
					if (axis_scores[impact.axis_id] !== undefined) {
						axis_scores[impact.axis_id] += impact.delta;
					} else {
						console.warn(`Axis ${impact.axis_id} not found in ideological axes, skipping impact`);
					}
				});
			}
		} else if (question.type === 'multiple_choice') {
			// Get impacts from selected option
			let selectedAnswerIndex = 0;
			if (choice === 'B') {
				selectedAnswerIndex = 1;
			} else if (choice === 'C') {
				selectedAnswerIndex = 2;
			}

			const selectedAnswer = question.answers?.[selectedAnswerIndex];
			if (selectedAnswer && selectedAnswer.impacts) {
				selectedAnswer.impacts.forEach((impact) => {
					if (impact.axis_id === 'privacy-comfort') {
						// Map privacy-comfort: delta = -1.0 (Privacy Detox) -> individual-collective += -0.6, market-state += 0.9
						// delta = +1.0 (Convenience) -> individual-collective += 0.6, market-state += -0.9
						axis_scores['individual-collective'] += impact.delta * 0.6;
						axis_scores['market-state'] += impact.delta * -0.9;
					} else if (axis_scores[impact.axis_id] !== undefined) {
						axis_scores[impact.axis_id] += impact.delta;
					} else {
						console.warn(`Axis ${impact.axis_id} not found in ideological axes, skipping impact`);
					}
				});
			}
		} else if (question.type === 'slider' && typeof choice === 'number') {
			const sliderVal = choice;
			const axisId = question.axis_id;

			if (axisId === 'consumption-ecology') {
				// Left (0) = Economy First, Right (100) = Ecology First
				const delta = ((sliderVal - 50) / 50) * 1.2;
				axis_scores['ecology-economy'] += delta;
			} else if (axisId === 'mental-health-performance') {
				// Left (0) = Collective/State, Right (100) = Individual/Market
				const deltaIC = ((50 - sliderVal) / 50) * 1.2;
				const deltaMS = ((50 - sliderVal) / 50) * 1.0;
				axis_scores['individual-collective'] += deltaIC;
				axis_scores['market-state'] += deltaMS;
			} else if (axisId) {
				let direction = -1; // Default direction (Left is +, Right is -)
				if (axisId === 'individual-collective' && questionId === 4) {
					direction = -1;
				} else if (axisId === 'ecology-economy' && questionId === 2) {
					direction = -1;
				}

				const delta = (direction * (sliderVal - 50) / 50) * 1.5;
				if (axis_scores[axisId] !== undefined) {
					axis_scores[axisId] += delta;
				}
			}
		} else if (question.type === 'budget_allocation' && choice && typeof choice === 'object') {
			if (questionId === 1) {
				const action = (choice as Record<string, number>)['action'] || 0;
				const adapt = (choice as Record<string, number>)['adapt'] || 0;
				
				axis_scores['market-state'] += (action - adapt) * 0.4;
				axis_scores['individual-collective'] += (action - adapt) * 0.3;
			} else if (questionId === 10) {
				const taxation = (choice as Record<string, number>)['taxation'] || 0;
				const freeMarket = (choice as Record<string, number>)['free-market'] || 0;

				axis_scores['market-state'] += (taxation - freeMarket) * 0.4;
				axis_scores['individual-collective'] += (taxation - freeMarket) * 0.36;
			}
		}
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
