import type { UserQuizAnswers, UserIdeologicalProfile, PartyIdeologicalProfile } from './types';
import type { Party, PartyData } from '$lib/parties';
import { parties } from '$lib/parties';
import { partyIdeologies } from './partyIdeologies';
import { calculateUserIdeology } from './calculateUserIdeology';
import { ideologicalAxes } from './ideologicalAxes';
import type { NarrativeQuestion } from '$lib/narrative/types';
import type { UserProfile } from '$lib/profiling/types';

export interface PartyMatch {
	party: PartyData;
	partyId: Party;
	distance: number;
	matchPercentage: number;
	axisDistances: Record<string, number>;
}

/**
 * Calculate axis weights dynamically based on user's profiling choices
 */
export function getAxisWeights(profilingProfile: UserProfile): Record<string, number> {
	const weights: Record<string, number> = {
		'market-state': 1.0,
		'individual-collective': 1.0,
		'progressive-conservative': 1.0,
		'ecology-economy': 1.0
	};

	if (!profilingProfile) return weights;

	const values = Object.values(profilingProfile);

	const socioeconomicPriorities = [
		'pension-security',      // Altersvorsorge und finanzielle Sicherheit
		'fair-wages',            // Faire Löhne und Arbeitsbedingungen
		'housing-bafög',         // Bezahlbares Wohnen und BAföG-Reform
		'social-security',       // Soziale Absicherung und Arbeitslosenunterstützung
		'pension-amount',        // Rentenhöhe und Alterssicherheit
		'healthcare-care',       // Gesundheitsversorgung und Pflege
		'retirement-transition', // Übergang in den Ruhestand und Rente
		'health-workload',       // Gesundheit und Arbeitsbelastung
		'family-security',       // Absicherung für die Familie
		'career-stability',      // Berufliche Entwicklung und Stabilität
		'childcare-family'       // Kinderbetreuung und Familienförderung
	];

	const marketPriorities = [
		'taxes-bureaucracy'      // Steuern und Bürokratieabbau
	];

	const ecologicalPriorities = [
		'climate-future',             // Klimaschutz und Zukunftsperspektiven
		'grandchildren-environment'   // Enkelkinder-Zukunft und Umweltschutz
	];

	const hasSocioeconomic = values.some(val => typeof val === 'string' && socioeconomicPriorities.includes(val));
	const hasMarket = values.some(val => typeof val === 'string' && marketPriorities.includes(val));
	const hasEcological = values.some(val => typeof val === 'string' && ecologicalPriorities.includes(val));

	const isWorkingOrUnemployed = values.some(val => val === 'employed' || val === 'unemployed');

	if (hasSocioeconomic) {
		weights['market-state'] = 2.0;
		weights['individual-collective'] = 2.0;
		if (isWorkingOrUnemployed) {
			weights['market-state'] = 2.5;
			weights['individual-collective'] = 2.5;
		}
	} else if (hasMarket) {
		weights['market-state'] = 2.0;
		weights['individual-collective'] = 1.5;
	}

	if (hasEcological) {
		weights['ecology-economy'] = 2.0;
	}

	return weights;
}

/**
 * Calculate Euclidean Distance for all axes
 */
function calculateEuclideanDistance(
	userScores: Record<string, number>,
	partyScores: Record<string, number>,
	weights: Record<string, number> = {
		'market-state': 1,
		'individual-collective': 1,
		'progressive-conservative': 1,
		'ecology-economy': 1
	}
): { distance: number; axisDistances: Record<string, number> } {
	let sumOfSquares = 0;
	const axisDistances: Record<string, number> = {};

	for (const axis in userScores) {
		if (partyScores[axis] !== undefined) {
			const difference = userScores[axis] - partyScores[axis];
			axisDistances[axis] = Math.abs(difference);
			const weight = weights[axis] !== undefined ? weights[axis] : 1.0;
			sumOfSquares += weight * difference * difference;
		}
	}

	return {
		distance: Math.sqrt(sumOfSquares),
		axisDistances
	};
}

/**
 * Convert distance to match percentage
 * Smaller distance = higher percentage
 * Maximum possible distance across 4 axes (1-10 scale) is sqrt(sumWeights * 9^2) = 9 * sqrt(sumWeights)
 * We calculate the max distance dynamically based on weights.
 */
function distanceToPercentage(distance: number, weights: Record<string, number>): number {
	let sumWeights = 0;
	for (const axis in weights) {
		sumWeights += weights[axis];
	}
	const maxDistance = 9 * Math.sqrt(sumWeights);
	const percentage = Math.max(0, 100 - (distance / maxDistance) * 100);
	return percentage;
}

/**
 * Calculate match percentages for all parties
 * Returns sorted array with best matches first
 */
export function calculateAllPartyMatches(
	userProfile: UserIdeologicalProfile,
	partyProfiles: PartyIdeologicalProfile[] = partyIdeologies,
	profilingProfile: UserProfile = {}
): PartyMatch[] {
	const matches: PartyMatch[] = [];
	const weights = getAxisWeights(profilingProfile);

	for (const partyProfile of partyProfiles) {
		const { distance, axisDistances } = calculateEuclideanDistance(
			userProfile.axis_scores,
			partyProfile.axis_scores,
			weights
		);

		const partyData = parties.find((p) => p.name === partyProfile.party_id);
		if (!partyData) continue;

		matches.push({
			party: partyData,
			partyId: partyProfile.party_id as Party,
			distance,
			matchPercentage: distanceToPercentage(distance, weights),
			axisDistances
		});
	}

	// Sort by distance (ascending) = best match first
	return matches.sort((a, b) => a.distance - b.distance);
}

export interface ChoiceImpact {
	questionId: number;
	storyText: string;
	chosenOption: {
		letter: 'A' | 'B' | 'C';
		text: string;
	};
	alternativeOption: {
		letter: 'A' | 'B' | 'C';
		text: string;
	};
	axisShifts: {
		axisId: string;
		axisName: string;
		delta: number;
		label: string;
	}[];
	partyMatchEffects: {
		partyId: string;
		partyName: string;
		deltaPercentage: number;
	}[];
}

/**
 * Calculate the impact of each narrative choice on the final party match percentage
 */
export function calculateChoiceImpacts(
	narrativeAnswers: Record<number, 'A' | 'B' | 'C'>,
	selectedQuestions: NarrativeQuestion[],
	profilingProfile: UserProfile = {}
): ChoiceImpact[] {
	const impacts: ChoiceImpact[] = [];

	const actualQuizAnswers: UserQuizAnswers = { narrative_choices: narrativeAnswers };
	const actualProfile = calculateUserIdeology(actualQuizAnswers, selectedQuestions, profilingProfile);
	const actualMatches = calculateAllPartyMatches(actualProfile, partyIdeologies, profilingProfile);

	for (const question of selectedQuestions) {
		if (question.type && question.type !== 'multiple_choice' && !question.optionA) continue;

		const chosenOptionLetter = narrativeAnswers[question.id];
		if (!chosenOptionLetter) continue;

		const altOptionLetter = chosenOptionLetter === 'A' ? 'B' : 'A';

		const altAnswers = { ...narrativeAnswers, [question.id]: altOptionLetter };
		const altQuizAnswers: UserQuizAnswers = { narrative_choices: altAnswers };
		const altProfile = calculateUserIdeology(altQuizAnswers, selectedQuestions, profilingProfile);
		const altMatches = calculateAllPartyMatches(altProfile, partyIdeologies, profilingProfile);

		let chosenOptionText = '';
		let chosenOptionImpacts: any[] = [];
		let altOptionText = '';

		if (question.optionA) {
			let chosenOption = question.optionA;
			if (chosenOptionLetter === 'B') {
				chosenOption = question.optionB;
			} else if (chosenOptionLetter === 'C' && question.optionC) {
				chosenOption = question.optionC;
			}
			chosenOptionText = chosenOption.text;
			chosenOptionImpacts = chosenOption.impacts;

			let alternativeOption = question.optionA;
			if (altOptionLetter === 'B') {
				alternativeOption = question.optionB;
			} else if (altOptionLetter === 'C' && question.optionC) {
				alternativeOption = question.optionC;
			}
			altOptionText = alternativeOption.text;
		} else if (question.answers) {
			const chosenIndex = chosenOptionLetter === 'A' ? 0 : chosenOptionLetter === 'B' ? 1 : 2;
			const altIndex = altOptionLetter === 'A' ? 0 : altOptionLetter === 'B' ? 1 : 2;

			const chosenAnswer = question.answers[chosenIndex] || question.answers[0];
			const altAnswer = question.answers[altIndex] || question.answers[0];

			chosenOptionText = chosenAnswer.text;
			chosenOptionImpacts = chosenAnswer.impacts || [];
			altOptionText = altAnswer.text;
		}

		const axisShifts = chosenOptionImpacts.map((impact) => {
			const axis = ideologicalAxes.find((a) => a.id === impact.axis_id);
			const axisName = axis?.name || impact.axis_id;
			const label = impact.delta >= 0 ? axis?.max_label || '' : axis?.min_label || '';
			return {
				axisId: impact.axis_id,
				axisName,
				delta: impact.delta,
				label
			};
		});

		const partyMatchEffects = actualMatches.map((actualMatch) => {
			const altMatch = altMatches.find((m) => m.partyId === actualMatch.partyId);
			const altPct = altMatch ? altMatch.matchPercentage : 0;
			return {
				partyId: actualMatch.partyId,
				partyName: actualMatch.party.name,
				deltaPercentage: actualMatch.matchPercentage - altPct
			};
		});

		impacts.push({
			questionId: question.id,
			storyText: question.story_text,
			chosenOption: {
				letter: chosenOptionLetter,
				text: chosenOptionText
			},
			alternativeOption: {
				letter: altOptionLetter,
				text: altOptionText
			},
			axisShifts,
			partyMatchEffects
		});
	}

	return impacts;
}
