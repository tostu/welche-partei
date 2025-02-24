import type { PageLoad } from './$types';
import { questions } from '$lib/questions';
export const prerender = false;

export const load: PageLoad = ({ params }) => {
	return {
		question: questions.filter((question) => question.id === Number(params.frage_id))[0] || {}
	};
};
