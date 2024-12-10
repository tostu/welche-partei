<script lang="ts">

	import Wohnsituation from '$lib/models/Wohnsituation.js';


	function getIconForWohnsituation(wohnsituation: Wohnsituation){
		switch (wohnsituation) {
			case Wohnsituation.ALLEIN:
				return "fluent-mdl2--contact";
			case Wohnsituation.BEI_ELTERN:
				return "fluent-mdl2--family";
			case Wohnsituation.MIT_PARTNER:
				return "fluent-mdl2--people";
			case Wohnsituation.GEMEINSCHAFTLICH:
				return "fluent-mdl2--group";

		}
	}
</script>

<div class="h-full flex items-center justify-evenly">
	{#each Object.values(Wohnsituation) as wohnsituation}
			<div class="card bg-secondary text-primary-content w-72 aspect-square hover:shadow-xl  transition-shadow duration-300 cursor-pointer">
				<div class="card-body text-center text-neutral">
					<span class="iconify {() => getIconForWohnsituation(wohnsituation)} h-full w-full"></span>
					<h2 class="card-title justify-center text-3xl mt-4 lilita-one-regular">{entry.title}</h2>
				</div>
			</div>
	{/each}
</div>


