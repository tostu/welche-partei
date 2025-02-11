<script lang="ts">
	let { rank, name, percentage }: { rank: number; name: string; percentage: number } = $props();

	let trend: number | undefined;

	function getVoteTrend() {
		// wretch(`result/${contestantId}/trend`)
		// 	.get()
		// 	.json((json) => {
		// 		trend = json;
		// 	});
	}

	function handleToggle(event: Event) {
		const details = event.target as HTMLDetailsElement;
		if (details.open) {
			getVoteTrend();
		}
	}
</script>

<details
	ontoggle={handleToggle}
	class="collapse cursor-pointer rounded-lg bg-base-200 transition-all duration-150 hover:shadow-md"
>
	<summary class="p-5">
		<div class="flex w-full gap-x-6">
			<span class="font-azeret text-frickeFont shrink-0 select-none text-7xl font-bold"
				>{rank.toString().padStart(2, '0')}</span
			>
			<div class="flex w-full min-w-0 flex-col gap-2">
				<div class="text-frickeFont flex w-full select-none justify-between text-2xl font-bold">
					<span class="mr-4 overflow-hidden text-ellipsis">{name}</span>
					<span class="shrink-0">{percentage.toFixed(0)} %</span>
				</div>
				<div class="relative w-full">
					<progress class="progress progress-secondary h-7 w-full" value={percentage} max="100"
					></progress>
					<div
						class="absolute left-0 right-0 top-0 flex select-none items-center justify-center font-bold text-gray-100"
					>
						{percentage.toFixed()}%
					</div>
				</div>
			</div>
		</div>
	</summary>
	<div class="h-full w-full px-5 pb-5 pt-2">
		<div class="border-t-2 border-t-base-300">
			<div class="mt-5 flex h-28 items-center justify-center justify-between gap-3">
				<div class="flex h-full w-1/3">
					<img
						src="https://picsum.photos/300/200"
						alt=""
						class="aspect-square rounded-md object-cover"
						style="width: auto; height: 100%"
					/>
					<div class="flex h-full w-full flex-col justify-between"></div>
				</div>
				<div class="stats w-2/3 bg-transparent">
					<div class="stat place-items-center">
						<div class="stat-title"></div>
						<div class="stat-value">31K</div>
						<div class="stat-desc">From January 1st to February 1st</div>
					</div>
					<div class="stat place-items-center">
						{#if trend !== undefined}
							<div class="stat-title">24h Trend</div>
							<div class="text-frickeRed stat-value">{trend}</div>
							<div class="text-frickeRed stat-desc">↗︎ 40 (2%)</div>
						{:else}
							<span class="loading loading-spinner loading-md"></span>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
</details>
