import type { Category, Answer } from '$lib/categories';
import type { Party } from '$lib/parties';

type PartyWeights = {
	[P in Party]: {
		[C in Category]?: Partial<Record<Answer<C>, number>>;
	};
};

export const partyWeights: PartyWeights = {
	AFD: {
		wohnen: { miete: 2, eigentum: 8 },
		einkommen: { niedrig: 5, mittel: 4, hoch: 8.4, sehr_hoch: 10 },
		lebenssituation: {
			erwerbstaetig: 5,
			selbstständig: 6,
			studierend_auszubildend: 2,
			arbeitslos_uebergangsphase: 2
		},
		familie: { kinderlos: 4, elternteil: 5, alleinerziehend: 2 },
		urbanisierung: { grossstadt: 3, laendlich: 7 },
		klima: { egal: 10, passiv: 8, mittel: 4, aktiv: 1 }
	},
	BSW: {
		wohnen: { miete: 8, eigentum: 3 },
		einkommen: { niedrig: 7, mittel: 4.5, hoch: 5, sehr_hoch: 4 },
		lebenssituation: {
			erwerbstaetig: 6,
			selbstständig: 5,
			studierend_auszubildend: 6,
			arbeitslos_uebergangsphase: 7
		},
		familie: { kinderlos: 5, elternteil: 6, alleinerziehend: 6 },
		urbanisierung: { grossstadt: 5, laendlich: 6 },
		klima: { egal: 3, passiv: 4, mittel: 6, aktiv: 7 }
	},
	CDU: {
		wohnen: { miete: 5, eigentum: 6 },
		einkommen: { niedrig: 2, mittel: 5, hoch: 7, sehr_hoch: 6.9 },
		lebenssituation: {
			erwerbstaetig: 8,
			selbstständig: 7,
			studierend_auszubildend: 4,
			arbeitslos_uebergangsphase: 4
		},
		familie: { kinderlos: 6, elternteil: 6, alleinerziehend: 4 },
		urbanisierung: { grossstadt: 6, laendlich: 6 },
		klima: { egal: 4, passiv: 6, mittel: 7, aktiv: 5 }
	},
	'Die Linke': {
		wohnen: { miete: 10, eigentum: 2 },
		einkommen: { niedrig: 10, mittel: 10, hoch: 1, sehr_hoch: 1 },
		lebenssituation: {
			erwerbstaetig: 4,
			selbstständig: 3,
			studierend_auszubildend: 7,
			arbeitslos_uebergangsphase: 9
		},
		familie: { kinderlos: 7, elternteil: 8, alleinerziehend: 9 },
		urbanisierung: { grossstadt: 7, laendlich: 4 },
		klima: { egal: 2, passiv: 3, mittel: 6, aktiv: 8 }
	},
	FDP: {
		wohnen: { miete: 1, eigentum: 10 },
		einkommen: { niedrig: 5, mittel: 6, hoch: 10, sehr_hoch: 10 },
		lebenssituation: {
			erwerbstaetig: 7,
			selbstständig: 9,
			studierend_auszubildend: 5,
			arbeitslos_uebergangsphase: 2
		},
		familie: { kinderlos: 5, elternteil: 4, alleinerziehend: 2 },
		urbanisierung: { grossstadt: 6, laendlich: 5 },
		klima: { egal: 3, passiv: 5, mittel: 7, aktiv: 6 }
	},
	'Die Grünen': {
		wohnen: { miete: 9, eigentum: 4 },
		einkommen: { niedrig: 1, mittel: 1, hoch: 1.5, sehr_hoch: 1.5 },
		lebenssituation: {
			erwerbstaetig: 6,
			selbstständig: 4,
			studierend_auszubildend: 8,
			arbeitslos_uebergangsphase: 6
		},
		familie: { kinderlos: 8, elternteil: 6, alleinerziehend: 7 },
		urbanisierung: { grossstadt: 9, laendlich: 3 },
		klima: { egal: 1, passiv: 3, mittel: 6, aktiv: 10 }
	},
	SPD: {
		wohnen: { miete: 7, eigentum: 4 },
		einkommen: { niedrig: 7, mittel: 4.5, hoch: 2.5, sehr_hoch: 2 },
		lebenssituation: {
			erwerbstaetig: 7,
			selbstständig: 5,
			studierend_auszubildend: 7,
			arbeitslos_uebergangsphase: 8
		},
		familie: { kinderlos: 7, elternteil: 7, alleinerziehend: 8 },
		urbanisierung: { grossstadt: 8, laendlich: 6 },
		klima: { egal: 3, passiv: 4, mittel: 6, aktiv: 8 }
	}
};
