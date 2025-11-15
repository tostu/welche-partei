<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import { policyEvidence, type Party } from '$lib/policyEvidence';

	export let party: Party;
	export let highlightCategories: string[] = [];

	let timelineContainer: HTMLDivElement;

	let exceeded = 0;
	let partial = 0;
	let delayed = 0;
	let broken = 0;

	// Get all promises for the party
	const allPromises = policyEvidence
		.flatMap((evidence) =>
			evidence.coalitionPromises
				.filter((p) => p.party === party)
				.map((p) => ({
					...p,
					category: evidence.category,
					displayName: evidence.displayName
				}))
		)
		.sort((a, b) => {
			const importanceOrder = { high: 0, medium: 1, low: 2 };
			return importanceOrder[a.importance] - importanceOrder[b.importance];
		});

	// Calculate stats
	exceeded = allPromises.filter((p) => p.status === 'exceeded').length;
	partial = allPromises.filter((p) => p.status === 'partial').length;
	delayed = allPromises.filter((p) => p.status === 'delayed').length;
	broken = allPromises.filter((p) => p.status === 'broken').length;

	const totalPromises = allPromises.length;
	const trustScore = ((exceeded + partial * 0.5) / totalPromises) * 100;

	onMount(() => {
		if (!timelineContainer || allPromises.length === 0) return;

		// Clear any existing SVG
		d3.select(timelineContainer).selectAll('*').remove();

		// Dimensions
		const margin = { top: 40, right: 20, bottom: 40, left: 200 };
		const width = timelineContainer.clientWidth - margin.left - margin.right;
		const height = Math.max(600, allPromises.length * 60);

		// Create SVG
		const svg = d3
			.select(timelineContainer)
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		// Scales
		const yScale = d3
			.scaleBand()
			.domain(allPromises.map((_, i) => i.toString()))
			.range([0, height])
			.padding(0.3);

		const xScale = d3.scaleLinear().domain([0, 3]).range([0, width]);

		// Color scale
		const colorScale = (status: string) => {
			switch (status) {
				case 'exceeded':
					return '#10b981'; // green
				case 'partial':
					return '#f59e0b'; // orange
				case 'delayed':
					return '#3b82f6'; // blue
				case 'broken':
					return '#ef4444'; // red
				default:
					return '#6b7280';
			}
		};

		// Draw timeline for each promise
		allPromises.forEach((promise, i) => {
			const y = yScale(i.toString())! + yScale.bandwidth() / 2;

			// Draw connecting line
			svg
				.append('line')
				.attr('x1', 0)
				.attr('y1', y)
				.attr('x2', width)
				.attr('y2', y)
				.attr('stroke', '#e5e7eb')
				.attr('stroke-width', 2)
				.attr('stroke-dasharray', '5,5');

			// Campaign Promise (Stage 1)
			svg
				.append('circle')
				.attr('cx', xScale(0))
				.attr('cy', y)
				.attr('r', 8)
				.attr('fill', '#3b82f6')
				.attr('stroke', '#fff')
				.attr('stroke-width', 2);

			// Coalition Agreement (Stage 2)
			svg
				.append('circle')
				.attr('cx', xScale(1.5))
				.attr('cy', y)
				.attr('r', 8)
				.attr('fill', '#8b5cf6')
				.attr('stroke', '#fff')
				.attr('stroke-width', 2);

			// Result (Stage 3)
			svg
				.append('circle')
				.attr('cx', xScale(3))
				.attr('cy', y)
				.attr('r', 10)
				.attr('fill', colorScale(promise.status))
				.attr('stroke', '#fff')
				.attr('stroke-width', 2);

			// Category label (left side)
			svg
				.append('text')
				.attr('x', -10)
				.attr('y', y)
				.attr('text-anchor', 'end')
				.attr('dominant-baseline', 'middle')
				.attr('font-size', '12px')
				.attr('font-weight', highlightCategories.includes(promise.category) ? '700' : '400')
				.attr('fill', highlightCategories.includes(promise.category) ? '#1f2937' : '#6b7280')
				.text(promise.displayName);

			// Importance indicator
			if (promise.importance === 'high') {
				svg
					.append('text')
					.attr('x', -190)
					.attr('y', y)
					.attr('text-anchor', 'start')
					.attr('dominant-baseline', 'middle')
					.attr('font-size', '14px')
					.attr('fill', '#dc2626')
					.text('❗');
			}
		});

		// Legend
		const stages = [
			{ x: 0, label: 'Versprechen' },
			{ x: 1.5, label: 'Koalition' },
			{ x: 3, label: 'Realität' }
		];

		stages.forEach((stage) => {
			svg
				.append('text')
				.attr('x', xScale(stage.x))
				.attr('y', -15)
				.attr('text-anchor', 'middle')
				.attr('font-size', '13px')
				.attr('font-weight', '600')
				.attr('fill', '#374151')
				.text(stage.label);
		});
	});
</script>

<div class="w-full">
	<div class="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
		<div class="rounded-lg bg-green-100 p-4">
			<div class="text-2xl font-bold text-green-700">{exceeded}</div>
			<div class="text-sm text-green-600">Übertroffen</div>
		</div>
		<div class="rounded-lg bg-orange-100 p-4">
			<div class="text-2xl font-bold text-orange-700">{partial}</div>
			<div class="text-sm text-orange-600">Teilweise</div>
		</div>
		<div class="rounded-lg bg-blue-100 p-4">
			<div class="text-2xl font-bold text-blue-700">{delayed}</div>
			<div class="text-sm text-blue-600">Verzögert</div>
		</div>
		<div class="rounded-lg bg-red-100 p-4">
			<div class="text-2xl font-bold text-red-700">{broken}</div>
			<div class="text-sm text-red-600">Gebrochen</div>
		</div>
	</div>

	<div class="mb-4 rounded-lg bg-base-300 p-4">
		<h3 class="mb-2 text-lg font-bold">Vertrauens-Score: {trustScore.toFixed(1)}%</h3>
		<div class="h-4 w-full rounded-full bg-gray-200">
			<div
				class="h-4 rounded-full bg-gradient-to-r from-green-500 to-orange-500"
				style="width: {trustScore}%"
			></div>
		</div>
		<p class="mt-2 text-xs text-gray-600">
			Berechnung: Übertroffen (100%) + Teilweise (50%) / Gesamtzahl
		</p>
	</div>

	<div bind:this={timelineContainer} class="w-full overflow-x-auto"></div>

	<div class="mt-6 overflow-x-auto">
		<table class="table table-zebra w-full">
			<thead>
				<tr>
					<th>Thema</th>
					<th>Versprechen</th>
					<th>Realität</th>
					<th>Status</th>
				</tr>
			</thead>
			<tbody>
				{#each allPromises as promise}
					<tr class={highlightCategories.includes(promise.category) ? 'bg-yellow-50' : ''}>
						<td class="font-semibold">
							{promise.displayName}
							{#if promise.importance === 'high'}
								<span class="text-red-600">❗</span>
							{/if}
						</td>
						<td class="max-w-xs">{promise.promise}</td>
						<td class="max-w-xs">{promise.result}</td>
						<td>
							{#if promise.status === 'exceeded'}
								<span class="badge badge-success">Übertroffen</span>
							{:else if promise.status === 'partial'}
								<span class="badge badge-warning">Teilweise</span>
							{:else if promise.status === 'delayed'}
								<span class="badge badge-info">Verzögert</span>
							{:else if promise.status === 'broken'}
								<span class="badge badge-error">Gebrochen</span>
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<style>
	:global(.table) {
		font-size: 0.875rem;
	}
</style>
