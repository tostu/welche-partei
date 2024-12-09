<script>

	const options = [
		{
			title: "Alleinständig",
			icon: "fluent-mdl2--contact"
		},
		{
			title: "Mit Familie",
			icon: "fluent-mdl2--family"
		}
	]

</script>

<div class="h-full flex items-center justify-evenly">
	{#each options as entry}
			<div class="card bg-secondary text-primary-content w-72 aspect-square hover:shadow-xl  transition-shadow duration-300 cursor-pointer">
				<div class="card-body text-center text-neutral">
					<span class="iconify {entry.icon} h-full w-full"></span>
					<h2 class="card-title justify-center text-3xl mt-4 lilita-one-regular">{entry.title}</h2>
				</div>
			</div>
	{/each}
</div>


