export const categories = {
	wohnen: ['miete', 'eigentum'] as const,
	einkommen: ['niedrig', 'mittel', 'hoch', 'sehr_hoch'] as const,
	lebenssituation: [
		'erwerbstaetig',
		'selbstständig',
		'studierend_auszubildend',
		'arbeitslos_uebergangsphase'
	] as const,
	familie: ['kinderlos', 'elternteil', 'alleinerziehend'],
	urbanisierung: ['grossstadt', 'laendlich'] as const
} as const;

export type Category = keyof typeof categories;
export type Answer<C extends Category> = (typeof categories)[C][number];
export type FullCategory = `${Category}_${Answer<Category>}`;
