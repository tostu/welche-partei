<script lang="ts">
	let {
		rank,
		name,
		percentage,
		basePercentage,
		penalty = 0
	}: {
		rank: number;
		name: string;
		percentage: number;
		basePercentage?: number;
		penalty?: number;
	} = $props();

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
	class="collapse cursor-pointer rounded-lg bg-base-250 border border-base-300/40 transition-all duration-150 hover:shadow-md"
>
	<summary class="p-5">
		<div class="flex w-full gap-x-6">
			<span class="font-azeret shrink-0 select-none text-7xl font-bold text-base-content/80"
				>{rank.toString().padStart(2, '0')}</span
			>
			<div class="flex w-full min-w-0 flex-col gap-2">
				<div
					class="flex w-full select-none items-center justify-between text-2xl font-bold text-base-content"
				>
					<span class="mr-4 flex items-center gap-2 overflow-hidden text-ellipsis">
						{name}
						{#if penalty > 0}
							<span
								class="badge badge-error badge-sm py-1 text-[10px] font-bold uppercase text-white"
								>-{penalty.toFixed(0)}% Abzug</span
							>
						{/if}
					</span>
					<span class="flex shrink-0 items-center gap-2">
						{#if penalty > 0 && basePercentage !== undefined}
							<span class="text-sm font-normal text-base-content/60 line-through"
								>{basePercentage.toFixed(0)}%</span
							>
						{/if}
						<span>{percentage.toFixed(0)} %</span>
					</span>
				</div>
				<div class="relative w-full">
					<progress class="progress progress-secondary h-7 w-full border border-base-300/30" value={percentage} max="100"
					></progress>
					<div
						class="absolute left-0 right-0 top-0 flex h-full select-none items-center justify-center font-bold text-slate-950"
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
