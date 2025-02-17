import parties from '$lib/parties';

interface Haushalt {
	haushaltstyp: string;
	einkommensklassen: Einkommensklasse[];
}

interface Einkommensklasse {
	bruttoeinkommen: number;
	parteien: Partei[];
}

interface Partei {
	name: string;
	veraenderung: number;
}

export const daten: Haushalt = {
	haushaltstyp: 'Ehepaar mit zwei Kindern, Alleinverdiener',
	einkommensklassen: [
		{
			bruttoeinkommen: 40000,
			parteien: [
				{ name: 'SPD', veraenderung: 860 },
				{ name: 'LINKE', veraenderung: 6150 },
				{ name: "B'90/GRÜNE", veraenderung: 870 },
				{ name: 'FDP', veraenderung: -1520 },
				{ name: 'CDU/CSU', veraenderung: 300 },
				{ name: 'AFD', veraenderung: -440 },
				{ name: 'BSW', veraenderung: 1010 }
			]
		},
		{
			bruttoeinkommen: 60000,
			parteien: [
				{ name: 'SPD', veraenderung: 1300 },
				{ name: 'LINKE', veraenderung: 6980 },
				{ name: "B'90/GRÜNE", veraenderung: 960 },
				{ name: 'FDP', veraenderung: 4800 },
				{ name: 'CDU/CSU', veraenderung: 850 },
				{ name: 'AFD', veraenderung: 5400 },
				{ name: 'BSW', veraenderung: 1790 }
			]
		},
		{
			bruttoeinkommen: 80000,
			parteien: [
				{ name: 'SPD', veraenderung: 1400 },
				{ name: 'LINKE', veraenderung: 7050 },
				{ name: "B'90/GRÜNE", veraenderung: 810 },
				{ name: 'FDP', veraenderung: 4050 },
				{ name: 'CDU/CSU', veraenderung: 1440 },
				{ name: 'AFD', veraenderung: 9630 },
				{ name: 'BSW', veraenderung: 1600 }
			]
		},
		{
			bruttoeinkommen: 120000,
			parteien: [
				{ name: 'SPD', veraenderung: 1520 },
				{ name: 'LINKE', veraenderung: 5180 },
				{ name: "B'90/GRÜNE", veraenderung: 670 },
				{ name: 'FDP', veraenderung: 7890 },
				{ name: 'CDU/CSU', veraenderung: 2770 },
				{ name: 'AFD', veraenderung: 12310 },
				{ name: 'BSW', veraenderung: 1220 }
			]
		},
		{
			bruttoeinkommen: 180000,
			parteien: [
				{ name: 'SPD', veraenderung: 2200 },
				{ name: 'LINKE', veraenderung: -800 },
				{ name: "B'90/GRÜNE", veraenderung: 100 },
				{ name: 'FDP', veraenderung: 11990 },
				{ name: 'CDU/CSU', veraenderung: 5840 },
				{ name: 'AFD', veraenderung: 19190 },
				{ name: 'BSW', veraenderung: 0 }
			]
		}
	]
};
