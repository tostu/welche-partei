<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import type { Party } from '$lib/policyEvidence';

	export let matchedParty: Party;
	export let matchScore: number;

	let chartContainer: HTMLDivElement;

	// 2025 Bundestag seat distribution
	const seatData = [
		{ party: 'CDU/CSU', seats: 197, color: '#000000', inCoalition: true },
		{ party: 'SPD', seats: 119, color: '#E3000F', inCoalition: true },
		{ party: 'Grüne', seats: 118, color: '#1AA037', inCoalition: false },
		{ party: 'AfD', seats: 78, color: '#009EE0', inCoalition: false },
		{ party: 'FDP', seats: 91, color: '#FFED00', inCoalition: false },
		{ party: 'Die Linke', seats: 39, color: '#BE3075', inCoalition: false },
		{ party: 'BSW', seats: 10, color: '#8B4513', inCoalition: false }
	];

	const totalSeats = seatData.reduce((sum, d) => sum + d.seats, 0);
	const majoritySeats = 316;
	const coalitionSeats = seatData.filter((d) => d.inCoalition).reduce((sum, d) => sum + d.seats, 0);

	const isOpposition = !['CDU', 'SPD'].includes(matchedParty);

	onMount(() => {
		if (!chartContainer) return;

		// Clear existing
		d3.select(chartContainer).selectAll('*').remove();

		const margin = { top: 40, right: 20, bottom: 60, left: 60 };
		const width = chartContainer.clientWidth - margin.left - margin.right;
		const height = 400 - margin.top - margin.bottom;

		const svg = d3
			.select(chartContainer)
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		// Scales
		const xScale = d3
			.scaleBand()
			.domain(seatData.map((d) => d.party))
			.range([0, width])
			.padding(0.3);

		const yScale = d3.scaleLinear().domain([0, 350]).range([height, 0]);

		// Axes
		svg
			.append('g')
			.attr('transform', `translate(0,${height})`)
			.call(d3.axisBottom(xScale))
			.selectAll('text')
			.attr('transform', 'rotate(-45)')
			.style('text-anchor', 'end')
			.style('font-size', '11px');

		svg.append('g').call(d3.axisLeft(yScale)).style('font-size', '11px');

		// Y-axis label
		svg
			.append('text')
			.attr('transform', 'rotate(-90)')
			.attr('y', -45)
			.attr('x', -height / 2)
			.attr('text-anchor', 'middle')
			.style('font-size', '12px')
			.style('font-weight', '600')
			.style('fill', '#002422')
			.text('Sitze im Bundestag');

		// Majority line
		svg
			.append('line')
			.attr('x1', 0)
			.attr('y1', yScale(majoritySeats))
			.attr('x2', width)
			.attr('y2', yScale(majoritySeats))
			.attr('stroke', '#dc2626')
			.attr('stroke-width', 3)
			.attr('stroke-dasharray', '8,4');

		svg
			.append('text')
			.attr('x', width - 5)
			.attr('y', yScale(majoritySeats) - 8)
			.attr('text-anchor', 'end')
			.style('fill', '#dc2626')
			.style('font-weight', '700')
			.style('font-size', '13px')
			.text(`Mehrheit: ${majoritySeats} Sitze`);

		// Bars
		svg
			.selectAll('.bar')
			.data(seatData)
			.enter()
			.append('rect')
			.attr('class', 'bar')
			.attr('x', (d) => xScale(d.party)!)
			.attr('y', (d) => yScale(d.seats))
			.attr('width', xScale.bandwidth())
			.attr('height', (d) => height - yScale(d.seats))
			.attr('fill', (d) => d.color)
			.attr('opacity', (d) => (d.party === matchedParty ? 1 : 0.7))
			.attr('stroke', (d) => (d.party === matchedParty ? '#1e293b' : 'none'))
			.attr('stroke-width', 3);

		// Seat count labels
		svg
			.selectAll('.label')
			.data(seatData)
			.enter()
			.append('text')
			.attr('class', 'label')
			.attr('x', (d) => xScale(d.party)! + xScale.bandwidth() / 2)
			.attr('y', (d) => yScale(d.seats) - 5)
			.attr('text-anchor', 'middle')
			.style('font-weight', '700')
			.style('font-size', '13px')
			.style('fill', '#f8fafc')
			.text((d) => d.seats);

		// Highlight matched party
		if (isOpposition) {
			svg
				.append('text')
				.attr('x', xScale(matchedParty)! + xScale.bandwidth() / 2)
				.attr('y', yScale(seatData.find((d) => d.party === matchedParty)!.seats) - 25)
				.attr('text-anchor', 'middle')
				.style('fill', '#0284c7')
				.style('font-weight', '700')
				.style('font-size', '12px')
				.text('← Ihre Wahl');
		}
	});
</script><div class="w-full rounded-lg bg-base-200 border border-base-300/40 p-6 shadow-xl">
	{#if isOpposition}
		<div class="alert alert-info bg-sky-50 border-sky-200 text-sky-850 mb-4 shadow-sm">
			<div class="flex flex-col gap-2">
				<div class="flex items-center gap-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						class="h-6 w-6 shrink-0 stroke-current text-sky-700"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						></path>
					</svg>
					<h3 class="font-bold text-sky-900">
						{matchedParty} ist in der Opposition ({matchScore.toFixed(0)}% Übereinstimmung)
					</h3>
				</div>
				<div class="text-sm text-slate-800">
					<p class="mb-2 font-medium">
						{matchedParty} stimmt zu {matchScore.toFixed(0)}% mit Ihren Ansichten überein. Hier die
						aktuelle parlamentarische Situation:
					</p>
					<ul class="ml-5 list-disc space-y-1">
						<li>
							<strong>Mehrheit benötigt:</strong> 316 von 632 Bundestagssitzen
						</li>
						<li>
							<strong>Aktuelle Koalition (CDU/SPD):</strong>
							{coalitionSeats} Sitze
						</li>
						<li>
							<strong>Oppositionsparteien gesamt:</strong>
							{totalSeats - coalitionSeats} Sitze
						</li>
						<li class="text-sky-900">
							<strong>54.3% der Wähler</strong> haben Oppositionsparteien gewählt
						</li>
					</ul>
					<p class="mt-3 text-xs opacity-75 font-semibold">
						Die Tabs unten zeigen, welche Positionen {matchedParty} vertritt.
					</p>
				</div>
			</div>
		</div>
	{:else}
		<div class="alert alert-success bg-emerald-50 border-emerald-200 text-emerald-850 mb-4 shadow-sm">
			<div class="flex flex-col gap-2">
				<div class="flex items-center gap-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6 shrink-0 stroke-current text-emerald-700"
						fill="none"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
						></path>
					</svg>
					<h3 class="font-bold text-emerald-900">
						{matchedParty} ist in der Regierung ({matchScore.toFixed(0)}% Übereinstimmung)
					</h3>
				</div>
				<div class="text-sm text-emerald-900 font-medium">
					<p>
						Diese Partei ist in der Regierung und hat die Mehrheit im Bundestag. Die Tabs unten
						zeigen, wie sie ihre Versprechen umgesetzt hat.
					</p>
				</div>
			</div>
		</div>
	{/if}

	<h3 class="mb-4 text-xl font-bold text-base-content">Sitzverteilung im Bundestag 2025</h3>
	<div bind:this={chartContainer} class="w-full"></div>

	<div class="mt-4 grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
		<div class="rounded-lg bg-base-300/40 border border-base-300/60 p-3">
			<div class="font-bold text-base-content/70">Gesamt</div>
			<div class="text-xl text-base-content font-bold">{totalSeats}</div>
			<div class="text-xs text-base-content/60">Sitze</div>
		</div>
		<div class="rounded-lg bg-green-50 border border-green-200 p-3 shadow-sm">
			<div class="font-bold text-green-800">Koalition</div>
			<div class="text-xl text-green-700 font-bold">{coalitionSeats}</div>
			<div class="text-xs text-green-600">CDU + SPD</div>
		</div>
		<div class="rounded-lg bg-sky-50 border border-sky-200 p-3 shadow-sm">
			<div class="font-bold text-sky-800">Opposition</div>
			<div class="text-xl text-sky-700 font-bold">{totalSeats - coalitionSeats}</div>
			<div class="text-xs text-sky-600">Alle anderen</div>
		</div>
		<div class="rounded-lg bg-red-50 border border-red-200 p-3 shadow-sm">
			<div class="font-bold text-red-800">Mehrheit</div>
			<div class="text-xl text-red-700 font-bold">{majoritySeats}</div>
			<div class="text-xs text-red-600">Benötigt</div>
		</div>
	</div>
</div>

<style>
	:global(.bar) {
		transition: opacity 0.3s;
	}
	:global(.bar:hover) {
		opacity: 1 !important;
	}
	:global(.domain) {
		stroke: #cbd5e1 !important;
	}
	:global(.tick line) {
		stroke: #cbd5e1 !important;
	}
	:global(.tick text) {
		fill: #002422 !important;
	}
</style>
