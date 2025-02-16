import type { Category, Answer } from '$lib/categories';
import type { Party } from '$lib/parties';

type PartyWeights = {
	[P in Party]: {
		[C in Category]?: Partial<Record<Answer<C>, number>>;
	};
};

export const partyWeights: PartyWeights = {
	AFD: {
		wohnen: { miete: 2, eigentum: 9 },
		einkommen: { niedrig: 3, mittel: 6, hoch: 8, sehr_hoch: 10 },
		lebenssituation: {
			erwerbstaetig: 7,
			selbstständig: 8,
			studierend_auszubildend: 3,
			arbeitslos_uebergangsphase: 2
		},
		familie: { kinderlos: 4, elternteil: 5, alleinerziehend: 3 },
		urbanisierung: { grossstadt: 3, laendlich: 8 }
	},
	BSW: {
		wohnen: { miete: 8, eigentum: 3 },
		einkommen: { niedrig: 9, mittel: 7, hoch: 2, sehr_hoch: 0 },
		lebenssituation: {
			erwerbstaetig: 7,
			selbstständig: 6,
			studierend_auszubildend: 6,
			arbeitslos_uebergangsphase: 5
		},
		familie: { kinderlos: 7, elternteil: 8, alleinerziehend: 8 },
		urbanisierung: { grossstadt: 7, laendlich: 6 }
	},
	CDU: {
		wohnen: { miete: 5, eigentum: 6 },
		einkommen: { niedrig: 4, mittel: 7, hoch: 6, sehr_hoch: 8 },
		lebenssituation: {
			erwerbstaetig: 6,
			selbstständig: 5,
			studierend_auszubildend: 6,
			arbeitslos_uebergangsphase: 4
		},
		familie: { kinderlos: 5, elternteil: 6, alleinerziehend: 5 },
		urbanisierung: { grossstadt: 6, laendlich: 6 }
	},
	'Die Linke': {
		wohnen: { miete: 10, eigentum: 2 },
		einkommen: { niedrig: 10, mittel: 5, hoch: 1, sehr_hoch: 0 },
		lebenssituation: {
			erwerbstaetig: 6,
			selbstständig: 4,
			studierend_auszubildend: 7,
			arbeitslos_uebergangsphase: 9
		},
		familie: { kinderlos: 6, elternteil: 8, alleinerziehend: 9 },
		urbanisierung: { grossstadt: 8, laendlich: 5 }
	},
	FDP: {
		wohnen: { miete: 1, eigentum: 10 },
		einkommen: { niedrig: 2, mittel: 5, hoch: 10, sehr_hoch: 9 },
		lebenssituation: {
			erwerbstaetig: 7,
			selbstständig: 8,
			studierend_auszubildend: 7,
			arbeitslos_uebergangsphase: 3
		},
		familie: { kinderlos: 6, elternteil: 3, alleinerziehend: 3 },
		urbanisierung: { grossstadt: 7, laendlich: 4 }
	},
	'Die Grünen': {
		wohnen: { miete: 9, eigentum: 4 },
		einkommen: { niedrig: 8, mittel: 7, hoch: 4, sehr_hoch: 2 },
		lebenssituation: {
			erwerbstaetig: 6,
			selbstständig: 5,
			studierend_auszubildend: 9,
			arbeitslos_uebergangsphase: 5
		},
		familie: { kinderlos: 6, elternteil: 7, alleinerziehend: 8 },
		urbanisierung: { grossstadt: 9, laendlich: 5 }
	},
	SPD: {
		wohnen: { miete: 7, eigentum: 4 },
		einkommen: { niedrig: 8, mittel: 6, hoch: 3, sehr_hoch: 2 },
		lebenssituation: {
			erwerbstaetig: 7,
			selbstständig: 5,
			studierend_auszubildend: 8,
			arbeitslos_uebergangsphase: 6
		},
		familie: { kinderlos: 5, elternteil: 7, alleinerziehend: 7 },
		urbanisierung: { grossstadt: 6, laendlich: 6 }
	}
};
