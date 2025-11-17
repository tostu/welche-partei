import type { IdeologicalAxis } from './types';

/**
 * Ideological Axes Configuration
 *
 * Defines the core ideological dimensions used to map user responses and party positions.
 * Each axis represents a fundamental political spectrum with clear extremes.
 *
 * These axes form the foundation of the ideology-based matching algorithm, allowing
 * users' narrative quiz responses to be mapped to multi-dimensional ideological profiles
 * that can then be compared against party positions.
 */
export const ideologicalAxes: IdeologicalAxis[] = [
	{
		id: 'market-state',
		name: 'Economic Approach',
		description: 'Market-driven solutions vs. State intervention',
		min_value: 1,
		max_value: 10,
		min_label: 'Free Market',
		max_label: 'State Control'
	},
	{
		id: 'individual-collective',
		name: 'Social Priority',
		description: 'Individual freedom vs. Collective responsibility',
		min_value: 1,
		max_value: 10,
		min_label: 'Individual First',
		max_label: 'Collective First'
	},
	{
		id: 'progressive-conservative',
		name: 'Social Values',
		description: 'Progressive change vs. Traditional values',
		min_value: 1,
		max_value: 10,
		min_label: 'Progressive',
		max_label: 'Conservative'
	},
	{
		id: 'ecology-economy',
		name: 'Environmental Priority',
		description: 'Ecological protection vs. Economic growth',
		min_value: 1,
		max_value: 10,
		min_label: 'Economy First',
		max_label: 'Ecology First'
	}
];
