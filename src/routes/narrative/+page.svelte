<script lang="ts">
	import NarrativeQuiz from '$lib/components/narrative/NarrativeQuiz.svelte';
	import type { UserProfile } from '$lib/profiling/types';

	// Mock user profile for testing
	const mockProfile: UserProfile = {
		'age-group': 'under-30',
		'employment-status-young': 'student',
		'student-priorities': 'housing-bafög'
	};
</script>

<NarrativeQuiz userProfile={mockProfile} />
