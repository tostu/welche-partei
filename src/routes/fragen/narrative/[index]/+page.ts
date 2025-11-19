import type { PageLoad } from './$types';
import { quizState } from '$lib/stores/quizState.svelte';
import { error, redirect } from '@sveltejs/kit';

export const prerender = false;

export const load: PageLoad = ({ params }) => {
	const index = Number(params.index);

	// Validate index
	if (isNaN(index) || index < 0) {
		throw error(400, 'Invalid question index');
	}

	// Check if profiling is complete
	if (!quizState.profilingComplete || quizState.selectedNarrativeQuestions.length === 0) {
		throw redirect(302, '/fragen/profiling/age-group');
	}

	// Check if index is within bounds
	if (index >= quizState.selectedNarrativeQuestions.length) {
		throw error(404, 'Question not found');
	}

	const question = quizState.selectedNarrativeQuestions[index];
	const totalQuestions = quizState.selectedNarrativeQuestions.length;

	return {
		question,
		index,
		totalQuestions
	};
};
