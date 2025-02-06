import type { FullCategory } from '$lib/categories';

export const answerState = $state<{ answerList: { category: FullCategory }[] }>({
	answerList: [] // Initialize with an empty array
});
