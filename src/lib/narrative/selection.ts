import type { NarrativeQuestion } from './types';
import { narrativeQuestions } from './questions';
import type { UserProfile } from '$lib/profiling/types';

/**
 * Mapping from profiling answer values to narrative question demographic tags
 *
 * This mapping enables personalized question selection by converting
 * profiling quiz answers into relevant demographic tags that match
 * the narrative question bank.
 *
 * **Design Principle:**
 * Each profiling answer value maps to one or more demographic tags.
 * The mapping is intentionally generous to ensure good question coverage.
 */
const PROFILE_TO_TAG_MAPPING: Record<string, string[]> = {
	// Age groups
	'under-30': ['young-professional', 'student', 'young-worker', 'young-family'],
	'30-50': ['middle-aged', 'parent', 'worker'],
	'over-50': ['senior'],

	// Employment status (young)
	student: ['student', 'education'],
	employed: ['worker', 'employment'],
	unemployed: ['employment', 'worker'],

	// Employment status (mid)
	'self-employed': ['worker', 'economy'],

	// Retirement status
	retired: ['senior', 'retirement'],
	working: ['worker', 'employment'],

	// Priorities (student)
	'housing-bafög': ['housing', 'urban'],
	'climate-future': ['climate', 'environment'],
	'digital-education': ['digital', 'technology', 'education'],

	// Priorities (young worker)
	'fair-wages': ['employment', 'labor', 'worker'],
	'work-life-balance': ['family', 'workplace'],
	'career-advancement': ['employment', 'workplace'],

	// Priorities (working, mid-career)
	'childcare-family': ['family', 'parent', 'childcare'],
	'pension-security': ['pension', 'social-security'],
	'career-stability': ['employment', 'workplace'],

	// Priorities (economic concerns)
	'taxes-bureaucracy': ['taxation', 'economy'],
	'social-security': ['social-security', 'equality'],
	'economic-innovation': ['economy', 'technology'],

	// Priorities (retirement)
	'pension-amount': ['pension', 'retirement'],
	'healthcare-care': ['healthcare', 'senior'],
	'grandchildren-environment': ['environment', 'climate'],

	// Priorities (senior working)
	'retirement-transition': ['pension', 'retirement'],
	'health-workload': ['healthcare', 'workplace'],
	'family-security': ['family', 'social-security']
};

/**
 * Extract demographic tags from user profile
 *
 * Converts profiling quiz answers into a set of relevant demographic tags
 * by looking up each answer value in the profile-to-tag mapping.
 *
 * @param userProfile - The user's profiling quiz answers
 * @returns Set of demographic tags derived from the profile
 */
function extractTagsFromProfile(userProfile: UserProfile): Set<string> {
	const tags = new Set<string>();

	Object.entries(userProfile).forEach(([key, value]) => {
		if (typeof value === 'string') {
			// String multiple choice
			const mappedTags = PROFILE_TO_TAG_MAPPING[value] || [];
			mappedTags.forEach((tag) => tags.add(tag));
		} else if (typeof value === 'number') {
			// Slider questions
			if (key === 'young-worker-priorities') {
				if (value < 45) {
					tags.add('work-culture');
					tags.add('economy');
				} else if (value > 55) {
					tags.add('lifestyle');
					tags.add('mental-health');
				}
			} else if (key === 'working-priorities') {
				if (value < 45) {
					tags.add('finance');
					tags.add('equality');
				} else if (value > 55) {
					tags.add('work-culture');
					tags.add('economy');
				}
			} else if (key === 'retirement-priorities') {
				if (value < 45) {
					tags.add('lifestyle');
					tags.add('healthcare');
				} else if (value > 55) {
					tags.add('family');
					tags.add('climate');
					tags.add('environment');
				}
			}
		} else if (value && typeof value === 'object') {
			// Budget allocation questions
			if (key === 'student-priorities') {
				const career = value['focus-career'] || 0;
				const lifestyle = value['focus-lifestyle'] || 0;
				const independence = value['focus-independence'] || 0;

				if (career >= 2) {
					tags.add('employment');
					tags.add('work-culture');
				}
				if (lifestyle >= 2) {
					tags.add('lifestyle');
					tags.add('mental-health');
				}
				if (independence >= 2) {
					tags.add('finance');
					tags.add('consumer-behavior');
				}
			}
		}
	});

	return tags;
}

/**
 * Score a narrative question based on profile match
 *
 * Calculates a relevance score for a question by counting how many
 * of its demographic tags match the user's profile tags.
 *
 * @param question - The narrative question to score
 * @param profileTags - Set of demographic tags from user profile
 * @returns Relevance score (number of matching tags)
 */
function scoreQuestion(question: NarrativeQuestion, profileTags: Set<string>): number {
	let score = 0;

	question.tags.forEach((tag) => {
		if (profileTags.has(tag)) {
			score++;
		}
	});

	return score;
}

/**
 * Shuffle array using Fisher-Yates algorithm
 *
 * Used to randomize question selection when there are ties in scoring
 * or when selecting from the full question bank.
 *
 * @param array - Array to shuffle (mutates the array)
 * @returns The shuffled array
 */
function shuffleArray<T>(array: T[]): T[] {
	const shuffled = [...array];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}

/**
 * Select Narrative Questions
 *
 * Dynamically selects 7-8 relevant narrative questions from the question bank
 * based on the user's profiling answers. Questions with matching demographic
 * tags are prioritized.
 *
 * **Selection Algorithm:**
 * 1. Extract demographic tags from user profile
 * 2. Score each question based on tag matches
 * 3. Sort questions by score (highest first)
 * 4. Return top 7-8 questions (8 if available, minimum 7)
 * 5. Shuffle questions with equal scores for variety
 *
 * **Edge Cases:**
 * - Empty profile: Returns random selection of 7-8 questions
 * - Insufficient questions: Returns all available questions (may be < 7)
 * - All questions tied (score 0): Random selection
 *
 * @param userProfile - User's profiling quiz answers
 * @param targetCount - Target number of questions to return (default: 8)
 * @returns Array of selected narrative questions (7-8 questions, or all available if fewer)
 *
 * @example
 * ```typescript
 * const profile: UserProfile = {
 *   'age-group': 'under-30',
 *   'employment-status-young': 'student',
 *   'student-priorities': 'housing-bafög'
 * };
 *
 * const questions = selectNarrativeQuestions(profile);
 * // Returns 7-8 questions, prioritizing those tagged with:
 * // 'young-professional', 'student', 'education', 'housing', 'urban'
 * ```
 */
export function selectNarrativeQuestions(
	userProfile: UserProfile,
	targetCount: number = 8
): NarrativeQuestion[] {
	// Edge case: No questions available
	if (narrativeQuestions.length === 0) {
		return [];
	}

	// If profiling has not run yet (empty profile), return targetCount shuffled questions (maintaining default/test behavior)
	if (Object.keys(userProfile).length === 0) {
		if (narrativeQuestions.length <= targetCount) {
			return shuffleArray(narrativeQuestions);
		}
		return shuffleArray(narrativeQuestions).slice(0, targetCount);
	}

	// Extract demographic tags from user profile
	const profileTags = extractTagsFromProfile(userProfile);

	const MAPPABLE_TAGS = new Set([
		'young-professional', 'student', 'young-worker', 'young-family',
		'middle-aged', 'parent', 'worker', 'senior',
		'education', 'employment', 'economy', 'retirement',
		'housing', 'urban', 'climate', 'environment',
		'digital', 'technology', 'labor', 'family',
		'workplace', 'work-culture', 'childcare', 'pension',
		'social-security', 'taxation', 'equality', 'finance',
		'lifestyle', 'mental-health', 'consumer-behavior',
		'healthcare', 'privacy', 'digital-life'
	]);

	// Filter out questions where mappable tags exist but none matched the user's profile
	const filteredQuestions = narrativeQuestions.filter((question) => {
		const questionMappableTags = question.tags.filter((tag) => MAPPABLE_TAGS.has(tag));

		// If the question has no mappable tags, it's a general question that cannot be deemed "not important"
		if (questionMappableTags.length === 0) {
			return true;
		}

		// If it has mappable tags, it must match at least one tag in the user's profile
		return questionMappableTags.some((tag) => profileTags.has(tag));
	});

	// Return all selected questions shuffled
	return shuffleArray(filteredQuestions);
}
