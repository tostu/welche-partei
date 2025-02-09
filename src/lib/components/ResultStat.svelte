<script lang="ts">
	import wretch from 'wretch';
	export let contestantId = '';
	export let rank: number = 0;
	export let name: string = '';
	export let totalVote: number = 0;
	export let totalPercentage: number = 0;

	let trend: number | undefined;

	function getVoteTrend() {
		wretch(`result/${contestantId}/trend`)
			.get()
			.json((json) => {
				trend = json;
			});
	}

	function handleToggle(event: Event) {
		const details = event.target as HTMLDetailsElement;
		if (details.open) {
			getVoteTrend();
		}
	}
</script>

<details
	on:toggle={handleToggle}
	class="collapse cursor-pointer rounded-sm bg-base-200 transition-all duration-150 hover:shadow-md"
>
	<summary class="p-5">
		<div class="flex w-full gap-x-6">
			<span class="shrink-0 select-none font-azeret text-7xl font-bold text-frickeFont"
				>{rank.toString().padStart(2, '0')}</span
			>
			<div class="flex w-full min-w-0 flex-col gap-2">
				<div class="flex w-full select-none justify-between text-2xl font-bold text-frickeFont">
					<span class="mr-4 overflow-hidden text-ellipsis">{name}</span>
					<span class="shrink-0">{totalVote.toLocaleString()}</span>
				</div>
				<div class="relative w-full">
					<progress class="progress progress-primary h-7 w-full" value={totalPercentage} max="100"
					></progress>
					<div
						class="absolute left-0 right-0 top-0 flex select-none items-center justify-center font-bold text-gray-100"
					>
						{totalPercentage.toFixed(1)}%
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
							<div class="stat-value text-frickeRed">{trend}</div>
							<div class="stat-desc text-frickeRed">↗︎ 40 (2%)</div>
						{:else}
							<span class="loading loading-spinner loading-md"></span>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
</details>
