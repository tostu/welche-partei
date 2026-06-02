import type { Answer, Category } from '$lib/categories';

export const answerState = $state<{ answerMap: Record<Category, Answer<Category> | undefined> }>({
	answerMap: {
		wohnen: undefined,
		einkommen: undefined,
		lebenssituation: undefined,
		familie: undefined,
		urbanisierung: undefined
	}
});
