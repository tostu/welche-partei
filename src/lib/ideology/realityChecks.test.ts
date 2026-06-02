import { describe, it, expect } from 'vitest';
import { calculatePartyPenalty, realityChecks, getHaertetestStatements } from './realityChecks';
import type { Party } from '$lib/parties';

describe('Reality Checks', () => {
	it('should have statements defined for all parties', () => {
		const partiesWithStatements = new Set(realityChecks.map((rc) => rc.partyId));
		const expectedParties: Party[] = [
			'AFD',
			'BSW',
			'CDU',
			'Die Linke',
			'FDP',
			'Die Grünen',
			'SPD',
			'Volt',
			'Freie Wähler',
			'Tierschutzpartei',
			'ÖDP',
			'Piratenpartei'
		];

		expectedParties.forEach((party) => {
			expect(partiesWithStatements.has(party)).toBe(true);
			const partyStatements = realityChecks.filter((rc) => rc.partyId === party);
			expect(partyStatements.length).toBeGreaterThan(0);
		});
	});

	it('should calculate zero penalty when user matches party stance', () => {
		// Mock answers that match the party stances
		const answers: Record<string, 'agree' | 'neutral' | 'disagree'> = {
			'bsw-russland': 'agree',
			'bsw-migration': 'agree'
		};

		const penalty = calculatePartyPenalty('BSW', answers);
		expect(penalty).toBe(0);
	});

	it('should calculate full penalty when user opposes party stance', () => {
		// BSW stands for 'agree' on both. Let's oppose them.
		const answers: Record<string, 'agree' | 'neutral' | 'disagree'> = {
			'bsw-russland': 'disagree', // penalty 15
			'bsw-migration': 'disagree' // penalty 10
		};

		const penalty = calculatePartyPenalty('BSW', answers);
		expect(penalty).toBe(25);
	});

	it('should calculate half penalty when user is neutral', () => {
		// BSW: 'bsw-russland' (penalty 15), 'bsw-migration' (penalty 10)
		const answers: Record<string, 'agree' | 'neutral' | 'disagree'> = {
			'bsw-russland': 'neutral', // 7.5
			'bsw-migration': 'neutral' // 5.0
		};

		const penalty = calculatePartyPenalty('BSW', answers);
		expect(penalty).toBe(12.5);
	});

	it('should combine different answers correctly', () => {
		// BSW: 'bsw-russland' (15), 'bsw-migration' (10)
		const answers: Record<string, 'agree' | 'neutral' | 'disagree'> = {
			'bsw-russland': 'disagree', // 15
			'bsw-migration': 'agree' // 0
		};

		const penalty = calculatePartyPenalty('BSW', answers);
		expect(penalty).toBe(15);
	});

	it('should ignore answers for other parties', () => {
		const answers: Record<string, 'agree' | 'neutral' | 'disagree'> = {
			'afd-dexit': 'disagree', // 15 penalty for AFD
			'bsw-migration': 'agree' // 0 penalty for BSW
		};

		const bswPenalty = calculatePartyPenalty('BSW', answers);
		expect(bswPenalty).toBe(0);

		const afdPenalty = calculatePartyPenalty('AFD', answers);
		expect(afdPenalty).toBe(15);
	});

	it('should get reality check statements for specific parties in order', () => {
		const statements = getHaertetestStatements(['BSW', 'AFD']);

		// Total BSW and AFD statements is 4
		expect(statements.length).toBe(4);

		// First two statements should be BSW
		expect(statements[0].partyId).toBe('BSW');
		expect(statements[1].partyId).toBe('BSW');

		// Next two should be AFD
		expect(statements[2].partyId).toBe('AFD');
		expect(statements[3].partyId).toBe('AFD');
	});
});
