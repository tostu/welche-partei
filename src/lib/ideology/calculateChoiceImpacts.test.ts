import { describe, it, expect } from 'vitest';
import { calculateChoiceImpacts } from './calculateAllMatches';
import type { NarrativeQuestion } from '$lib/narrative/types';

const mockQuestions: NarrativeQuestion[] = [
	{
		id: 1,
		type: 'multiple_choice' as const,
		story_text: 'Mock Question 1',
		answers: [
			{
				text: 'Option A1',
				impacts: [
					{ axis_id: 'market-state', delta: -2.0 },
					{ axis_id: 'individual-collective', delta: -1.0 }
				]
			},
			{
				text: 'Option B1',
				impacts: [
					{ axis_id: 'market-state', delta: 2.0 },
					{ axis_id: 'individual-collective', delta: 1.0 }
				]
			}
		],
		tags: ['housing']
	},
	{
		id: 2,
		type: 'multiple_choice' as const,
		story_text: 'Mock Question 2',
		answers: [
			{
				text: 'Option A2',
				impacts: [{ axis_id: 'ecology-economy', delta: -2.0 }]
			},
			{
				text: 'Option B2',
				impacts: [{ axis_id: 'ecology-economy', delta: 2.0 }]
			}
		],
		tags: ['climate']
	}
];

describe('calculateChoiceImpacts', () => {
	it('should calculate correct choice impacts', () => {
		const answers: Record<number, 'A' | 'B' | 'C'> = {
			1: 'A',
			2: 'B'
		};

		const impacts = calculateChoiceImpacts(answers, mockQuestions);

		expect(impacts.length).toBe(2);

		// Question 1 Verification
		const firstImpact = impacts.find((i) => i.questionId === 1);
		expect(firstImpact).toBeDefined();
		expect(firstImpact!.chosenOption.letter).toBe('A');
		expect(firstImpact!.alternativeOption.letter).toBe('B');
		expect(firstImpact!.storyText).toBe('Mock Question 1');

		// Axis shifts validation
		expect(firstImpact!.axisShifts.length).toBe(2);
		const shift = firstImpact!.axisShifts.find((s) => s.axisId === 'market-state');
		expect(shift).toBeDefined();
		expect(shift!.delta).toBe(-2.0);

		// Party effects validation
		expect(firstImpact!.partyMatchEffects.length).toBeGreaterThan(0);
		firstImpact!.partyMatchEffects.forEach((effect) => {
			expect(typeof effect.deltaPercentage).toBe('number');
			expect(Number.isNaN(effect.deltaPercentage)).toBe(false);
		});
	});
});
