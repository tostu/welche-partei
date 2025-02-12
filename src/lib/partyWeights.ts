export const partyWeights: Record<
	Party, // Partei-Name
	Record<Category, Partial<Record<Answer<Category>, number>>>
> = {
	'Die Linke': {
		wohnen: {
			miete: 10,
			eigentum: 2
		},
		einkommen: {
			niedrig: 10,
			mittel: 5,
			hoch: 1
		},
		lebenssituation: {
			erwerbstaetig: 6,
			selbstständig: 4,
			studierend_auszubildend: 7,
			arbeitslos_uebergangsphase: 9,
			alleinerziehend: 9,
			wohnungslos: 10
		},
		urbanisierung: {
			grossstadt: 8,
			laendlich: 5
		},
		prioritaet: {
			soziale_gerechtigkeit: 10,
			klimapolitik: 8,
			steuerentlastung: 3,
			infrastruktur: 6,
			eigentumsfoerderung: 2,
			marktloesungen: 1
		}
	},
	SPD: {
		wohnen: {
			miete: 7,
			eigentum: 4
		},
		einkommen: {
			niedrig: 8,
			mittel: 6,
			hoch: 3
		},
		lebenssituation: {
			erwerbstaetig: 7,
			selbstständig: 5,
			studierend_auszubildend: 8,
			arbeitslos_uebergangsphase: 6,
			alleinerziehend: 7,
			wohnungslos: 6
		},
		urbanisierung: {
			grossstadt: 6,
			laendlich: 6
		},
		prioritaet: {
			soziale_gerechtigkeit: 8,
			klimapolitik: 7,
			steuerentlastung: 5,
			infrastruktur: 7,
			eigentumsfoerderung: 4,
			marktloesungen: 3
		}
	},
	AFD: {
		wohnen: {
			miete: 2,
			eigentum: 9
		},
		einkommen: {
			niedrig: 1,
			mittel: 4,
			hoch: 8
		},
		lebenssituation: {
			erwerbstaetig: 5,
			selbstständig: 6,
			studierend_auszubildend: 4,
			arbeitslos_uebergangsphase: 3,
			alleinerziehend: 3,
			wohnungslos: 2
		},
		urbanisierung: {
			grossstadt: 3,
			laendlich: 8
		},
		prioritaet: {
			soziale_gerechtigkeit: 2,
			klimapolitik: 1,
			steuerentlastung: 9,
			infrastruktur: 5,
			eigentumsfoerderung: 8,
			marktloesungen: 9
		}
	},
	BSW: {
		wohnen: {
			miete: 8,
			eigentum: 3
		},
		einkommen: {
			niedrig: 9,
			mittel: 7,
			hoch: 2
		},
		lebenssituation: {
			erwerbstaetig: 7,
			selbstständig: 6,
			studierend_auszubildend: 6,
			arbeitslos_uebergangsphase: 5,
			alleinerziehend: 8,
			wohnungslos: 7
		},
		urbanisierung: {
			grossstadt: 7,
			laendlich: 6
		},
		prioritaet: {
			soziale_gerechtigkeit: 10,
			klimapolitik: 5,
			steuerentlastung: 4,
			infrastruktur: 7,
			eigentumsfoerderung: 3,
			marktloesungen: 2
		}
	},
	CDU: {
		wohnen: {
			miete: 5,
			eigentum: 6
		},
		einkommen: {
			niedrig: 4,
			mittel: 7,
			hoch: 6
		},
		lebenssituation: {
			erwerbstaetig: 6,
			selbstständig: 5,
			studierend_auszubildend: 6,
			arbeitslos_uebergangsphase: 4,
			alleinerziehend: 5,
			wohnungslos: 4
		},
		urbanisierung: {
			grossstadt: 6,
			laendlich: 6
		},
		prioritaet: {
			soziale_gerechtigkeit: 6,
			klimapolitik: 5,
			steuerentlastung: 7,
			infrastruktur: 8,
			eigentumsfoerderung: 6,
			marktloesungen: 5
		}
	},
	FDP: {
		wohnen: {
			miete: 1,
			eigentum: 10
		},
		einkommen: {
			niedrig: 2,
			mittel: 5,
			hoch: 10
		},
		lebenssituation: {
			erwerbstaetig: 7,
			selbstständig: 8,
			studierend_auszubildend: 7,
			arbeitslos_uebergangsphase: 3,
			alleinerziehend: 3,
			wohnungslos: 2
		},
		urbanisierung: {
			grossstadt: 7,
			laendlich: 4
		},
		prioritaet: {
			soziale_gerechtigkeit: 2,
			klimapolitik: 4,
			steuerentlastung: 9,
			infrastruktur: 6,
			eigentumsfoerderung: 8,
			marktloesungen: 10
		}
	},
	'Die Grünen': {
		wohnen: {
			miete: 8,
			eigentum: 4
		},
		einkommen: {
			niedrig: 9,
			mittel: 7,
			hoch: 3
		},
		lebenssituation: {
			erwerbstaetig: 7,
			selbstständig: 6,
			studierend_auszubildend: 9,
			arbeitslos_uebergangsphase: 7,
			alleinerziehend: 8,
			wohnungslos: 7
		},
		urbanisierung: {
			grossstadt: 9,
			laendlich: 4
		},
		prioritaet: {
			soziale_gerechtigkeit: 8,
			klimapolitik: 10,
			steuerentlastung: 3,
			infrastruktur: 7,
			eigentumsfoerderung: 2,
			marktloesungen: 1
		}
	}
};
