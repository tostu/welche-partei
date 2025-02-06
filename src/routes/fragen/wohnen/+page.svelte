<script lang="ts">
	import Wohnsituation from '$lib/models/Wohnsituation.js';

	function getIconForWohnsituation(wohnsituation: Wohnsituation) {
		switch (wohnsituation) {
			case Wohnsituation.ALLEIN:
				return 'fluent-mdl2--contact';
			case Wohnsituation.BEI_ELTERN:
				return 'fluent-mdl2--family';
			case Wohnsituation.MIT_PARTNER:
				return 'fluent-mdl2--people';
			case Wohnsituation.GEMEINSCHAFTLICH:
				return 'fluent-mdl2--group';
		}
	}
</script>

<div class="flex h-full items-center justify-evenly">
	{#each Object.values(Wohnsituation) as wohnsituation}
		<div
			class="card aspect-square w-72 cursor-pointer bg-secondary text-primary-content transition-shadow duration-300 hover:shadow-xl"
		>
			<div class="card-body text-center text-neutral">
				<span class="iconify {() => getIconForWohnsituation(wohnsituation)} h-full w-full"></span>
				<h2 class="lilita-one-regular card-title mt-4 justify-center text-3xl">{entry.title}</h2>
			</div>
		</div>
	{/each}
</div>
