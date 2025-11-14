<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	// Election data from the research
	const electionResults2025 = [
		{ party: 'CDU/CSU', votes: 28.5, seats: 208, color: '#000000' },
		{ party: 'AfD', votes: 20.8, seats: 152, color: '#009ee0' },
		{ party: 'SPD', votes: 16.4, seats: 120, color: '#E3000F' },
		{ party: 'Greens', votes: 11.6, seats: 85, color: '#1AA037' },
		{ party: 'Die Linke', votes: 8.8, seats: 65, color: '#BE3075' },
		{ party: 'FDP', votes: 4.3, seats: 0, color: '#FFED00' },
		{ party: 'BSW', votes: 5.0, seats: 0, color: '#8B4789' }
	];

	const electionResults2021 = [
		{ party: 'CDU/CSU', votes: 24.1, seats: 197, color: '#000000' },
		{ party: 'SPD', votes: 25.7, seats: 206, color: '#E3000F' },
		{ party: 'Greens', votes: 14.7, seats: 118, color: '#1AA037' },
		{ party: 'FDP', votes: 11.4, seats: 92, color: '#FFED00' },
		{ party: 'AfD', votes: 10.4, seats: 83, color: '#009ee0' },
		{ party: 'Die Linke', votes: 4.9, seats: 39, color: '#BE3075' }
	];

	const budgetData = [
		{ category: 'Social Security/Pensions', amount: 190.0, percent: 37.8 },
		{ category: 'Investment', amount: 115.7, percent: 23.0 },
		{ category: 'Defense', amount: 62.4, percent: 12.4 },
		{ category: 'Infrastructure', amount: 38.0, percent: 7.6 },
		{ category: 'Other', amount: 96.4, percent: 19.2 }
	];

	const defenseSpending = [
		{ year: 2021, amount: 50, gdp: 1.5 },
		{ year: 2024, amount: 90.8, gdp: 2.1 },
		{ year: 2025, amount: 94.0, gdp: 2.4 },
		{ year: 2029, amount: 162.0, gdp: 5.0 }
	];

	const coalitionSatisfaction = [
		{ date: 'Dec 2021', support: 52, coalition: 'Traffic Light' },
		{ date: 'Mid 2023', support: 35, coalition: 'Traffic Light' },
		{ date: 'Pre-Election', support: 31, coalition: 'Traffic Light' },
		{ date: 'Election Day', support: 45, coalition: 'Grand Coalition' },
		{ date: 'Sep 2025', support: 22, coalition: 'Grand Coalition' }
	];

	const promiseFulfillment = [
		{ status: 'Fully Implemented', count: 174, percent: 38 },
		{ status: 'Implementation Begun', count: 118, percent: 26 },
		{ status: 'Not Started', count: 161, percent: 36 }
	];

	onMount(() => {
		createElectionComparison();
		createBudgetChart();
		createDefenseChart();
		createSatisfactionChart();
		createPromiseChart();
		createPartyChangeChart();
	});

	function createElectionComparison() {
		const margin = { top: 40, right: 30, bottom: 80, top: 20, left: 60 };
		const width = 600 - margin.left - margin.right;
		const height = 400 - margin.top - margin.bottom;

		const svg = d3
			.select('#election-comparison')
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		const parties = electionResults2025.map((d) => d.party);
		const x0 = d3.scaleBand().domain(parties).rangeRound([0, width]).paddingInner(0.1);

		const x1 = d3.scaleBand().domain(['2021', '2025']).rangeRound([0, x0.bandwidth()]).padding(0.05);

		const y = d3
			.scaleLinear()
			.domain([0, 30])
			.range([height, 0]);

		// Add X axis
		svg
			.append('g')
			.attr('transform', `translate(0,${height})`)
			.call(d3.axisBottom(x0))
			.selectAll('text')
			.attr('transform', 'rotate(-45)')
			.style('text-anchor', 'end');

		// Add Y axis
		svg.append('g').call(d3.axisLeft(y).ticks(10).tickFormat((d) => d + '%'));

		// Create bars for 2021
		const data2021Map = new Map(electionResults2021.map((d) => [d.party, d.votes]));

		parties.forEach((party) => {
			const g = svg.append('g').attr('transform', `translate(${x0(party)},0)`);

			const votes2021 = data2021Map.get(party) || 0;
			const votes2025 = electionResults2025.find((d) => d.party === party)?.votes || 0;
			const color = electionResults2025.find((d) => d.party === party)?.color || '#999';

			// 2021 bar
			g.append('rect')
				.attr('x', x1('2021') || 0)
				.attr('y', y(votes2021))
				.attr('width', x1.bandwidth())
				.attr('height', height - y(votes2021))
				.attr('fill', color)
				.attr('opacity', 0.5);

			// 2025 bar
			g.append('rect')
				.attr('x', x1('2025') || 0)
				.attr('y', y(votes2025))
				.attr('width', x1.bandwidth())
				.attr('height', height - y(votes2025))
				.attr('fill', color)
				.attr('opacity', 1);
		});

		// Legend
		const legend = svg.append('g').attr('transform', `translate(${width - 100}, -10)`);

		legend
			.append('rect')
			.attr('x', 0)
			.attr('y', 0)
			.attr('width', 20)
			.attr('height', 20)
			.attr('fill', '#666')
			.attr('opacity', 0.5);
		legend.append('text').attr('x', 25).attr('y', 15).text('2021').style('font-size', '12px');

		legend
			.append('rect')
			.attr('x', 0)
			.attr('y', 25)
			.attr('width', 20)
			.attr('height', 20)
			.attr('fill', '#666')
			.attr('opacity', 1);
		legend.append('text').attr('x', 25).attr('y', 40).text('2025').style('font-size', '12px');

		// Title
		svg
			.append('text')
			.attr('x', width / 2)
			.attr('y', -5)
			.attr('text-anchor', 'middle')
			.style('font-size', '16px')
			.style('font-weight', 'bold')
			.text('Election Results: 2021 vs 2025 (%)');
	}

	function createBudgetChart() {
		const width = 500;
		const height = 500;
		const radius = Math.min(width, height) / 2;

		const svg = d3
			.select('#budget-chart')
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.append('g')
			.attr('transform', `translate(${width / 2},${height / 2})`);

		const color = d3
			.scaleOrdinal()
			.domain(budgetData.map((d) => d.category))
			.range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00']);

		const pie = d3
			.pie<{ category: string; amount: number; percent: number }>()
			.value((d) => d.amount)
			.sort(null);

		const arc = d3
			.arc<d3.PieArcDatum<{ category: string; amount: number; percent: number }>>()
			.innerRadius(0)
			.outerRadius(radius - 10);

		const labelArc = d3
			.arc<d3.PieArcDatum<{ category: string; amount: number; percent: number }>>()
			.innerRadius(radius - 80)
			.outerRadius(radius - 80);

		const arcs = svg
			.selectAll('.arc')
			.data(pie(budgetData))
			.enter()
			.append('g')
			.attr('class', 'arc');

		arcs
			.append('path')
			.attr('d', arc)
			.attr('fill', (d) => color(d.data.category) as string)
			.attr('stroke', 'white')
			.attr('stroke-width', 2)
			.on('mouseover', function (event, d) {
				d3.select(this).attr('opacity', 0.7);
			})
			.on('mouseout', function () {
				d3.select(this).attr('opacity', 1);
			});

		arcs
			.append('text')
			.attr('transform', (d) => `translate(${labelArc.centroid(d)})`)
			.attr('text-anchor', 'middle')
			.style('font-size', '11px')
			.style('font-weight', 'bold')
			.text((d) => `${d.data.percent}%`);

		// Legend
		const legend = svg
			.append('g')
			.attr('transform', `translate(${radius + 20}, ${-radius + 20})`);

		budgetData.forEach((d, i) => {
			const legendRow = legend.append('g').attr('transform', `translate(0, ${i * 25})`);

			legendRow
				.append('rect')
				.attr('width', 15)
				.attr('height', 15)
				.attr('fill', color(d.category) as string);

			legendRow
				.append('text')
				.attr('x', 20)
				.attr('y', 12)
				.style('font-size', '11px')
				.text(`${d.category} (€${d.amount}B)`);
		});

		// Title
		svg
			.append('text')
			.attr('x', 0)
			.attr('y', -radius - 30)
			.attr('text-anchor', 'middle')
			.style('font-size', '16px')
			.style('font-weight', 'bold')
			.text('2025 Budget Allocation (€502.5B Total)');
	}

	function createDefenseChart() {
		const margin = { top: 40, right: 100, bottom: 50, left: 60 };
		const width = 600 - margin.left - margin.right;
		const height = 400 - margin.top - margin.bottom;

		const svg = d3
			.select('#defense-chart')
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		const x = d3
			.scaleLinear()
			.domain([2021, 2029])
			.range([0, width]);

		const y = d3
			.scaleLinear()
			.domain([0, 180])
			.range([height, 0]);

		// Add X axis
		svg
			.append('g')
			.attr('transform', `translate(0,${height})`)
			.call(d3.axisBottom(x).tickFormat(d3.format('d')));

		// Add Y axis
		svg.append('g').call(d3.axisLeft(y).tickFormat((d) => '€' + d + 'B'));

		// Add line for amount
		const line = d3
			.line<{ year: number; amount: number; gdp: number }>()
			.x((d) => x(d.year))
			.y((d) => y(d.amount));

		svg
			.append('path')
			.datum(defenseSpending)
			.attr('fill', 'none')
			.attr('stroke', '#e74c3c')
			.attr('stroke-width', 3)
			.attr('d', line);

		// Add dots
		svg
			.selectAll('circle')
			.data(defenseSpending)
			.enter()
			.append('circle')
			.attr('cx', (d) => x(d.year))
			.attr('cy', (d) => y(d.amount))
			.attr('r', 6)
			.attr('fill', '#e74c3c')
			.attr('stroke', 'white')
			.attr('stroke-width', 2);

		// Add labels
		svg
			.selectAll('.label')
			.data(defenseSpending)
			.enter()
			.append('text')
			.attr('x', (d) => x(d.year))
			.attr('y', (d) => y(d.amount) - 15)
			.attr('text-anchor', 'middle')
			.style('font-size', '11px')
			.style('font-weight', 'bold')
			.text((d) => `€${d.amount}B (${d.gdp}%)`);

		// NATO 2% line
		const nato2Percent = 90; // Approximate
		svg
			.append('line')
			.attr('x1', 0)
			.attr('x2', width)
			.attr('y1', y(nato2Percent))
			.attr('y2', y(nato2Percent))
			.attr('stroke', '#3498db')
			.attr('stroke-width', 2)
			.attr('stroke-dasharray', '5,5');

		svg
			.append('text')
			.attr('x', width - 5)
			.attr('y', y(nato2Percent) - 5)
			.attr('text-anchor', 'end')
			.style('font-size', '11px')
			.style('fill', '#3498db')
			.text('NATO 2% Target');

		// Title
		svg
			.append('text')
			.attr('x', width / 2)
			.attr('y', -15)
			.attr('text-anchor', 'middle')
			.style('font-size', '16px')
			.style('font-weight', 'bold')
			.text('Defense Spending Trajectory (2021-2029)');

		// Y axis label
		svg
			.append('text')
			.attr('transform', 'rotate(-90)')
			.attr('y', -45)
			.attr('x', -height / 2)
			.attr('text-anchor', 'middle')
			.style('font-size', '12px')
			.text('Budget (Billions €)');
	}

	function createSatisfactionChart() {
		const margin = { top: 40, right: 30, bottom: 80, left: 60 };
		const width = 600 - margin.left - margin.right;
		const height = 400 - margin.top - margin.bottom;

		const svg = d3
			.select('#satisfaction-chart')
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		const x = d3
			.scaleBand()
			.domain(coalitionSatisfaction.map((d) => d.date))
			.range([0, width])
			.padding(0.2);

		const y = d3
			.scaleLinear()
			.domain([0, 60])
			.range([height, 0]);

		// Add X axis
		svg
			.append('g')
			.attr('transform', `translate(0,${height})`)
			.call(d3.axisBottom(x))
			.selectAll('text')
			.attr('transform', 'rotate(-45)')
			.style('text-anchor', 'end');

		// Add Y axis
		svg.append('g').call(d3.axisLeft(y).tickFormat((d) => d + '%'));

		// Add bars
		svg
			.selectAll('rect')
			.data(coalitionSatisfaction)
			.enter()
			.append('rect')
			.attr('x', (d) => x(d.date) || 0)
			.attr('y', (d) => y(d.support))
			.attr('width', x.bandwidth())
			.attr('height', (d) => height - y(d.support))
			.attr('fill', (d) => (d.coalition === 'Traffic Light' ? '#f39c12' : '#2c3e50'));

		// Add value labels
		svg
			.selectAll('.label')
			.data(coalitionSatisfaction)
			.enter()
			.append('text')
			.attr('x', (d) => (x(d.date) || 0) + x.bandwidth() / 2)
			.attr('y', (d) => y(d.support) - 5)
			.attr('text-anchor', 'middle')
			.style('font-size', '12px')
			.style('font-weight', 'bold')
			.text((d) => d.support + '%');

		// Legend
		const legend = svg.append('g').attr('transform', `translate(${width - 150}, 10)`);

		legend.append('rect').attr('x', 0).attr('y', 0).attr('width', 20).attr('height', 20).attr('fill', '#f39c12');
		legend.append('text').attr('x', 25).attr('y', 15).text('Traffic Light').style('font-size', '12px');

		legend.append('rect').attr('x', 0).attr('y', 25).attr('width', 20).attr('height', 20).attr('fill', '#2c3e50');
		legend.append('text').attr('x', 25).attr('y', 40).text('Grand Coalition').style('font-size', '12px');

		// Title
		svg
			.append('text')
			.attr('x', width / 2)
			.attr('y', -15)
			.attr('text-anchor', 'middle')
			.style('font-size', '16px')
			.style('font-weight', 'bold')
			.text('Coalition Satisfaction Over Time');
	}

	function createPromiseChart() {
		const margin = { top: 40, right: 30, bottom: 60, left: 60 };
		const width = 500 - margin.left - margin.right;
		const height = 400 - margin.top - margin.bottom;

		const svg = d3
			.select('#promise-chart')
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		const x = d3
			.scaleBand()
			.domain(promiseFulfillment.map((d) => d.status))
			.range([0, width])
			.padding(0.3);

		const y = d3
			.scaleLinear()
			.domain([0, 200])
			.range([height, 0]);

		const colors = d3.scaleOrdinal().domain(promiseFulfillment.map((d) => d.status)).range(['#27ae60', '#f39c12', '#e74c3c']);

		// Add X axis
		svg
			.append('g')
			.attr('transform', `translate(0,${height})`)
			.call(d3.axisBottom(x))
			.selectAll('text')
			.call((text) => text.each(function () {
				const text = d3.select(this);
				const words = text.text().split(/\s+/);
				text.text('');
				words.forEach((word, i) => {
					text
						.append('tspan')
						.attr('x', 0)
						.attr('dy', i === 0 ? 0 : '1.1em')
						.text(word);
				});
			}))
			.style('text-anchor', 'middle');

		// Add Y axis
		svg.append('g').call(d3.axisLeft(y));

		// Add bars
		svg
			.selectAll('rect')
			.data(promiseFulfillment)
			.enter()
			.append('rect')
			.attr('x', (d) => x(d.status) || 0)
			.attr('y', (d) => y(d.count))
			.attr('width', x.bandwidth())
			.attr('height', (d) => height - y(d.count))
			.attr('fill', (d) => colors(d.status) as string);

		// Add labels
		svg
			.selectAll('.label')
			.data(promiseFulfillment)
			.enter()
			.append('text')
			.attr('x', (d) => (x(d.status) || 0) + x.bandwidth() / 2)
			.attr('y', (d) => y(d.count) - 5)
			.attr('text-anchor', 'middle')
			.style('font-size', '12px')
			.style('font-weight', 'bold')
			.text((d) => `${d.count} (${d.percent}%)`);

		// Title
		svg
			.append('text')
			.attr('x', width / 2)
			.attr('y', -15)
			.attr('text-anchor', 'middle')
			.style('font-size', '16px')
			.style('font-weight', 'bold')
			.text('2021-2024 Coalition Promise Fulfillment');

		// Y axis label
		svg
			.append('text')
			.attr('transform', 'rotate(-90)')
			.attr('y', -45)
			.attr('x', -height / 2)
			.attr('text-anchor', 'middle')
			.style('font-size', '12px')
			.text('Number of Promises');
	}

	function createPartyChangeChart() {
		const margin = { top: 40, right: 30, bottom: 80, left: 60 };
		const width = 600 - margin.left - margin.right;
		const height = 400 - margin.top - margin.bottom;

		const svg = d3
			.select('#party-change-chart')
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		// Calculate changes
		const changes = electionResults2025.map((d) => {
			const result2021 = electionResults2021.find((r) => r.party === d.party);
			const change = result2021 ? d.votes - result2021.votes : d.votes;
			return { party: d.party, change, color: d.color };
		});

		const x = d3
			.scaleBand()
			.domain(changes.map((d) => d.party))
			.range([0, width])
			.padding(0.2);

		const y = d3
			.scaleLinear()
			.domain([-10, 12])
			.range([height, 0]);

		// Add X axis
		svg
			.append('g')
			.attr('transform', `translate(0,${height})`)
			.call(d3.axisBottom(x))
			.selectAll('text')
			.attr('transform', 'rotate(-45)')
			.style('text-anchor', 'end');

		// Add Y axis
		svg.append('g').call(d3.axisLeft(y).tickFormat((d) => d + '%'));

		// Zero line
		svg
			.append('line')
			.attr('x1', 0)
			.attr('x2', width)
			.attr('y1', y(0))
			.attr('y2', y(0))
			.attr('stroke', '#333')
			.attr('stroke-width', 2);

		// Add bars
		svg
			.selectAll('rect')
			.data(changes)
			.enter()
			.append('rect')
			.attr('x', (d) => x(d.party) || 0)
			.attr('y', (d) => (d.change >= 0 ? y(d.change) : y(0)))
			.attr('width', x.bandwidth())
			.attr('height', (d) => Math.abs(y(d.change) - y(0)))
			.attr('fill', (d) => d.color);

		// Add labels
		svg
			.selectAll('.label')
			.data(changes)
			.enter()
			.append('text')
			.attr('x', (d) => (x(d.party) || 0) + x.bandwidth() / 2)
			.attr('y', (d) => (d.change >= 0 ? y(d.change) - 5 : y(0) + 15))
			.attr('text-anchor', 'middle')
			.style('font-size', '11px')
			.style('font-weight', 'bold')
			.text((d) => (d.change >= 0 ? '+' : '') + d.change.toFixed(1) + '%');

		// Title
		svg
			.append('text')
			.attr('x', width / 2)
			.attr('y', -15)
			.attr('text-anchor', 'middle')
			.style('font-size', '16px')
			.style('font-weight', 'bold')
			.text('Vote Share Change: 2021 to 2025');

		// Y axis label
		svg
			.append('text')
			.attr('transform', 'rotate(-90)')
			.attr('y', -45)
			.attr('x', -height / 2)
			.attr('text-anchor', 'middle')
			.style('font-size', '12px')
			.text('Change in Vote Share (%)');
	}
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
	<div class="mx-auto max-w-7xl">
		<!-- Header -->
		<div class="mb-12 text-center">
			<h1 class="mb-4 text-5xl font-bold text-slate-800">
				Germany's 2025 Bundestagswahl Data Visualization
			</h1>
			<p class="text-xl text-slate-600">
				Interactive D3.js visualizations of election results, budget allocations, and political trends
			</p>
			<p class="mt-2 text-sm text-slate-500">
				Based on comprehensive research of the February 23, 2025 snap election
			</p>
		</div>

		<!-- Key Stats Cards -->
		<div class="mb-12 grid grid-cols-1 gap-6 md:grid-cols-4">
			<div class="rounded-lg bg-white p-6 shadow-lg">
				<div class="text-3xl font-bold text-blue-600">82.5%</div>
				<div class="text-sm text-slate-600">Voter Turnout</div>
				<div class="mt-1 text-xs text-slate-500">Highest since 1987</div>
			</div>
			<div class="rounded-lg bg-white p-6 shadow-lg">
				<div class="text-3xl font-bold text-red-600">€502.5B</div>
				<div class="text-sm text-slate-600">2025 Budget</div>
				<div class="mt-1 text-xs text-slate-500">+16.3% net borrowing</div>
			</div>
			<div class="rounded-lg bg-white p-6 shadow-lg">
				<div class="text-3xl font-bold text-green-600">5.0% GDP</div>
				<div class="text-sm text-slate-600">Defense by 2029</div>
				<div class="mt-1 text-xs text-slate-500">€162B projected</div>
			</div>
			<div class="rounded-lg bg-white p-6 shadow-lg">
				<div class="text-3xl font-bold text-purple-600">22%</div>
				<div class="text-sm text-slate-600">Coalition Satisfaction</div>
				<div class="mt-1 text-xs text-slate-500">Sep 2025</div>
			</div>
		</div>

		<!-- Charts Grid -->
		<div class="grid grid-cols-1 gap-8 xl:grid-cols-2">
			<!-- Election Comparison -->
			<div class="rounded-lg bg-white p-6 shadow-lg">
				<div id="election-comparison" class="flex justify-center"></div>
				<p class="mt-4 text-center text-sm text-slate-600">
					CDU/CSU won with 28.5% despite being their second-worst result since 1949. AfD doubled support to 20.8%,
					becoming the second-largest party.
				</p>
			</div>

			<!-- Budget Allocation -->
			<div class="rounded-lg bg-white p-6 shadow-lg">
				<div id="budget-chart" class="flex justify-center"></div>
				<p class="mt-4 text-center text-sm text-slate-600">
					Social security dominates at 37.8% (€190B), while infrastructure fell from €53B planned to €38B actual.
				</p>
			</div>

			<!-- Defense Spending -->
			<div class="rounded-lg bg-white p-6 shadow-lg">
				<div id="defense-chart" class="flex justify-center"></div>
				<p class="mt-4 text-center text-sm text-slate-600">
					Historic 72% increase from 2024 to 2029. Germany positions as Europe's defense leader, exceeding NATO's 2% target.
				</p>
			</div>

			<!-- Coalition Satisfaction -->
			<div class="rounded-lg bg-white p-6 shadow-lg">
				<div id="satisfaction-chart" class="flex justify-center"></div>
				<p class="mt-4 text-center text-sm text-slate-600">
					Grand Coalition satisfaction plummeted from 45% on election day to just 22% by September 2025,
					mirroring previous coalition's decline.
				</p>
			</div>

			<!-- Party Change -->
			<div class="rounded-lg bg-white p-6 shadow-lg">
				<div id="party-change-chart" class="flex justify-center"></div>
				<p class="mt-4 text-center text-sm text-slate-600">
					AfD gained +10.4 points (largest increase), while SPD lost -9.3 points (largest decrease).
					FDP crashed out of parliament entirely.
				</p>
			</div>

			<!-- Promise Fulfillment -->
			<div class="rounded-lg bg-white p-6 shadow-lg">
				<div id="promise-chart" class="flex justify-center"></div>
				<p class="mt-4 text-center text-sm text-slate-600">
					Previous Traffic Light coalition (2021-2024) fulfilled 64% of 453 promises, though only 12%
					of public believed it.
				</p>
			</div>
		</div>

		<!-- Key Insights -->
		<div class="mt-12 rounded-lg bg-white p-8 shadow-lg">
			<h2 class="mb-6 text-2xl font-bold text-slate-800">Key Insights from the Data</h2>
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<div>
					<h3 class="mb-2 font-bold text-slate-700">Electoral Shifts</h3>
					<ul class="space-y-2 text-sm text-slate-600">
						<li>• AfD surge to 20.8% represents doubling from 2021 (10.4%)</li>
						<li>• SPD historic collapse to 16.4%, worst since 1887</li>
						<li>• Die Linke surprise resurgence to 8.8% (captured 25% of youth vote)</li>
						<li>• FDP eliminated from parliament with 4.3%</li>
					</ul>
				</div>
				<div>
					<h3 class="mb-2 font-bold text-slate-700">Policy Implementation</h3>
					<ul class="space-y-2 text-sm text-slate-600">
						<li>• Defense spending exceeds all promises (5% GDP vs 2% promised)</li>
						<li>• Infrastructure investment shifted €15B to social spending</li>
						<li>• Neither CDU nor SPD achieved core welfare promises</li>
						<li>• Climate targets abandoned (coal 2038 vs 2030)</li>
					</ul>
				</div>
				<div>
					<h3 class="mb-2 font-bold text-slate-700">Budget Priorities</h3>
					<ul class="space-y-2 text-sm text-slate-600">
						<li>• Social security: €190B (37.8% of budget)</li>
						<li>• Defense: €62.4B (12.4%), rising to €162B by 2029</li>
						<li>• Infrastructure: Only €38B despite €500B fund</li>
						<li>• Net borrowing: €81.8B (16.3% of budget)</li>
					</ul>
				</div>
				<div>
					<h3 class="mb-2 font-bold text-slate-700">Democratic Challenges</h3>
					<ul class="space-y-2 text-sm text-slate-600">
						<li>• AfD designated extremist, faces potential ban</li>
						<li>• Coalition satisfaction: 22% (Sep 2025)</li>
						<li>• CDU/CSU + SPD: Only 45% combined vote share</li>
						<li>• Fragmentation threatens traditional party system</li>
					</ul>
				</div>
			</div>
		</div>

		<!-- Footer -->
		<div class="mt-8 text-center text-sm text-slate-500">
			<p>Data source: Germany's 2025 Bundestagswahl comprehensive research report</p>
			<p class="mt-1">Visualizations created with D3.js v7</p>
		</div>
	</div>
</div>

<style>
	:global(body) {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
			sans-serif;
	}
</style>
