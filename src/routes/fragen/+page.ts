import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const prerender = false;

export const load: PageLoad = () => {
	// Redirect to the start of the profiling phase
	throw redirect(302, '/fragen/profiling/age-group');
};
