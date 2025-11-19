import type { PageLoad } from './$types';
import { getQuestionById } from '$lib/profiling/questions';
import { error } from '@sveltejs/kit';

export const prerender = false;

export const load: PageLoad = ({ params }) => {
	const question = getQuestionById(params.question_id);

	if (!question) {
		throw error(404, 'Question not found');
	}

	return {
		question
	};
};
