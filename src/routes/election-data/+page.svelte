<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	// CDU/CSU Campaign Promises with Fulfillment Status
	const cduPromises = [
		{
			area: 'Immigration',
			promise: 'De facto immigration freeze',
			result: 'Coordinated EU approach',
			status: 'broken',
			importance: 'high'
		},
		{
			area: 'Social Welfare',
			promise: 'Abolish Bürgergeld entirely',
			result: 'Frozen but continues',
			status: 'broken',
			importance: 'high'
		},
		{
			area: 'Economy',
			promise: '25% corporate tax immediately',
			result: '25% phased 2028-2033',
			status: 'delayed',
			importance: 'medium'
		},
		{
			area: 'Defense',
			promise: 'Minimum 2% GDP',
			result: '5% GDP by 2029',
			status: 'exceeded',
			importance: 'high'
		},
		{
			area: 'Education',
			promise: 'Mandatory language tests',
			result: 'Not implemented',
			status: 'broken',
			importance: 'medium'
		},
		{
			area: 'Education',
			promise: 'Nationwide Abitur standard',
			result: 'Faces state resistance',
			status: 'broken',
			importance: 'low'
		},
		{
			area: 'Defense',
			promise: 'Escalating military service',
			result: 'Under study, not implemented',
			status: 'delayed',
			importance: 'low'
		},
		{
			area: 'Immigration',
			promise: 'Deportations to Syria/Afghanistan',
			result: 'Afghanistan only, Syria blocked',
			status: 'partial',
			importance: 'medium'
		}
	];

	const spdPromises = [
		{
			area: 'Social Welfare',
			promise: '48% pension guarantee (RED LINE)',
			result: 'Vague protection only',
			status: 'broken',
			importance: 'high'
		},
		{
			area: 'Economy',
			promise: '€15 minimum wage by 2026 (RED LINE)',
			result: '€14.60 by 2027, commission decides',
			status: 'broken',
			importance: 'high'
		},
		{
			area: 'Climate',
			promise: '65% emissions cut by 2030',
			result: 'No specific 2030 target',
			status: 'broken',
			importance: 'high'
		},
		{
			area: 'Climate',
			promise: '75% renewable electricity by 2030',
			result: 'No target specified',
			status: 'broken',
			importance: 'high'
		},
		{
			area: 'Climate',
			promise: 'Coal phase-out 2030',
			result: 'Reverted to 2038',
			status: 'broken',
			importance: 'high'
		},
		{
			area: 'Economy',
			promise: 'Wealth tax on millionaires',
			result: 'Abandoned entirely',
			status: 'broken',
			importance: 'medium'
		},
		{
			area: 'Housing',
			promise: 'Permanent rent brake',
			result: 'Vague commitment',
			status: 'broken',
			importance: 'medium'
		},
		{
			area: 'Healthcare',
			promise: '€1,000/month care cost cap',
			result: 'Under study',
			status: 'partial',
			importance: 'medium'
		},
		{
			area: 'Education',
			promise: 'BAföG full grant (no loan)',
			result: 'Not adopted',
			status: 'broken',
			importance: 'low'
		},
		{
			area: 'Defense',
			promise: 'Minimum 2% GDP',
			result: '5% GDP by 2029',
			status: 'exceeded',
			importance: 'high'
		}
	];

	// Aggregate promise data by status
	const promisesByStatus = [
		{ party: 'CDU/CSU', status: 'Exceeded', count: 1, color: '#27ae60' },
		{ party: 'CDU/CSU', status: 'Partial', count: 1, color: '#f39c12' },
		{ party: 'CDU/CSU', status: 'Delayed', count: 2, color: '#e67e22' },
		{ party: 'CDU/CSU', status: 'Broken', count: 4, color: '#e74c3c' },
		{ party: 'SPD', status: 'Exceeded', count: 1, color: '#27ae60' },
		{ party: 'SPD', status: 'Partial', count: 1, color: '#f39c12' },
		{ party: 'SPD', status: 'Delayed', count: 0, color: '#e67e22' },
		{ party: 'SPD', status: 'Broken', count: 8, color: '#e74c3c' }
	];

	// Policy area breakdown
	const policyAreas = [
		{ area: 'Climate', cduBroken: 0, spdBroken: 3, total: 3 },
		{ area: 'Social Welfare', cduBroken: 1, spdBroken: 1, total: 2 },
		{ area: 'Economy', cduBroken: 0, spdBroken: 1, total: 3 },
		{ area: 'Immigration', cduBroken: 1, spdBroken: 0, total: 2 },
		{ area: 'Education', cduBroken: 2, spdBroken: 1, total: 3 },
		{ area: 'Housing', cduBroken: 0, spdBroken: 1, total: 1 },
		{ area: 'Healthcare', cduBroken: 0, spdBroken: 0, total: 1 }
	];

	// Key broken promises timeline
	const brokenPromisesTimeline = [
		{ date: 'Campaign', event: 'CDU: "Abolish Bürgergeld"', status: 'promised', party: 'CDU' },
		{ date: 'Campaign', event: 'SPD: "48% pension guarantee"', status: 'promised', party: 'SPD' },
		{
			date: 'Campaign',
			event: 'SPD: "€15 minimum wage by 2026"',
			status: 'promised',
			party: 'SPD'
		},
		{ date: 'Campaign', event: 'SPD: "Coal exit by 2030"', status: 'promised', party: 'SPD' },
		{
			date: 'April 2025',
			event: 'Coalition Agreement: Bürgergeld frozen, not abolished',
			status: 'broken',
			party: 'CDU'
		},
		{
			date: 'April 2025',
			event: 'Coalition Agreement: No 48% guarantee',
			status: 'broken',
			party: 'SPD'
		},
		{
			date: 'April 2025',
			event: 'Coalition Agreement: Commission decides minimum wage',
			status: 'broken',
			party: 'SPD'
		},
		{
			date: 'April 2025',
			event: 'Coalition Agreement: Coal 2038, not 2030',
			status: 'broken',
			party: 'SPD'
		},
		{ date: 'Nov 2025', event: 'No climate legislation passed', status: 'ongoing', party: 'both' }
	];

	// Detailed promise comparison data
	const detailedComparison = [
		{
			category: 'Climate Neutrality',
			cdu: '2045',
			spd: '2045 (65% by 2030)',
			result: '2045 (flexible path)',
			fulfillment: 40
		},
		{
			category: 'Renewable Energy',
			cdu: 'No specific %',
			spd: '75% by 2030',
			result: 'No target specified',
			fulfillment: 0
		},
		{
			category: 'Corporate Tax',
			cdu: '25% immediately',
			spd: 'Increase on wealthy',
			result: '25% phased 2028-2033',
			fulfillment: 40
		},
		{
			category: 'Defense Spending',
			cdu: 'Min 2% GDP',
			spd: 'Min 2% GDP',
			result: '5% GDP by 2029',
			fulfillment: 150
		},
		{
			category: 'Minimum Wage',
			cdu: 'Commission decides',
			spd: '€15 by 2026',
			result: 'Commission decides',
			fulfillment: 20
		},
		{
			category: 'Pension Level',
			cdu: 'No specific %',
			spd: 'Min 48% guarantee',
			result: 'Vague protection',
			fulfillment: 10
		},
		{
			category: 'Immigration',
			cdu: 'De facto freeze',
			spd: 'Humanitarian balance',
			result: 'Coordinated approach',
			fulfillment: 50
		}
	];

	// Red lines data
	const redLines = [
		{
			party: 'SPD',
			redline: '48% pension guarantee',
			result: 'Vague protection only',
			broken: true
		},
		{ party: 'SPD', redline: '€15 minimum wage by 2026', result: '€14.60 by 2027', broken: true },
		{
			party: 'SPD',
			redline: 'Keep Bürgergeld',
			result: 'Frozen with stricter rules',
			broken: true
		},
		{ party: 'CDU', redline: 'Abolish Bürgergeld', result: 'Frozen but continues', broken: true },
		{ party: 'CDU', redline: 'Immigration freeze', result: 'Coordinated EU approach', broken: true }
	];

	onMount(() => {
		createPromiseStatusChart();
		createPolicyAreaChart();
		createFulfillmentGaugeChart();
		createRedLinesChart();
		createDetailedComparisonChart();
		createPromiseBreakdownChart();
	});

	function createPromiseStatusChart() {
		const margin = { top: 40, right: 30, bottom: 80, left: 60 };
		const width = 600 - margin.left - margin.right;
		const height = 400 - margin.top - margin.bottom;

		const svg = d3
			.select('#promise-status-chart')
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		const parties = ['CDU/CSU', 'SPD'];
		const statuses = ['Exceeded', 'Partial', 'Delayed', 'Broken'];

		const x0 = d3.scaleBand().domain(parties).rangeRound([0, width]).paddingInner(0.1);

		const x1 = d3.scaleBand().domain(statuses).rangeRound([0, x0.bandwidth()]).padding(0.05);

		const y = d3.scaleLinear().domain([0, 10]).range([height, 0]);

		const color = d3
			.scaleOrdinal()
			.domain(statuses)
			.range(['#27ae60', '#f39c12', '#e67e22', '#e74c3c']);

		// X axis
		svg
			.append('g')
			.attr('transform', `translate(0,${height})`)
			.call(d3.axisBottom(x0))
			.selectAll('text')
			.style('font-size', '14px')
			.style('font-weight', 'bold');

		// Y axis
		svg.append('g').call(d3.axisLeft(y).ticks(10));

		// Create bars
		const partyGroups = svg
			.selectAll('.party-group')
			.data(parties)
			.enter()
			.append('g')
			.attr('transform', (d) => `translate(${x0(d)},0)`);

		statuses.forEach((status) => {
			partyGroups.each(function (party) {
				const data = promisesByStatus.find((d) => d.party === party && d.status === status);
				if (data) {
					d3.select(this)
						.append('rect')
						.attr('x', x1(status) || 0)
						.attr('y', y(data.count))
						.attr('width', x1.bandwidth())
						.attr('height', height - y(data.count))
						.attr('fill', data.color);

					// Add labels
					if (data.count > 0) {
						d3.select(this)
							.append('text')
							.attr('x', (x1(status) || 0) + x1.bandwidth() / 2)
							.attr('y', y(data.count) - 5)
							.attr('text-anchor', 'middle')
							.style('font-size', '12px')
							.style('font-weight', 'bold')
							.text(data.count);
					}
				}
			});
		});

		// Legend
		const legend = svg.append('g').attr('transform', `translate(${width - 150}, -10)`);

		statuses.forEach((status, i) => {
			legend
				.append('rect')
				.attr('x', 0)
				.attr('y', i * 20)
				.attr('width', 15)
				.attr('height', 15)
				.attr('fill', color(status) as string);

			legend
				.append('text')
				.attr('x', 20)
				.attr('y', i * 20 + 12)
				.text(status)
				.style('font-size', '11px');
		});

		// Title
		svg
			.append('text')
			.attr('x', width / 2)
			.attr('y', -15)
			.attr('text-anchor', 'middle')
			.style('font-size', '16px')
			.style('font-weight', 'bold')
			.text('Promise Fulfillment Status by Party');

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

	function createPolicyAreaChart() {
		const margin = { top: 40, right: 30, bottom: 80, left: 100 };
		const width = 600 - margin.left - margin.right;
		const height = 400 - margin.top - margin.bottom;

		const svg = d3
			.select('#policy-area-chart')
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		const x = d3.scaleLinear().domain([-3, 3]).range([0, width]);

		const y = d3
			.scaleBand()
			.domain(policyAreas.map((d) => d.area))
			.range([0, height])
			.padding(0.2);

		// X axis
		svg.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x).ticks(6));

		// Y axis
		svg.append('g').call(d3.axisLeft(y));

		// Zero line
		svg
			.append('line')
			.attr('x1', x(0))
			.attr('x2', x(0))
			.attr('y1', 0)
			.attr('y2', height)
			.attr('stroke', '#333')
			.attr('stroke-width', 2);

		// CDU bars (left side, negative)
		svg
			.selectAll('.cdu-bar')
			.data(policyAreas)
			.enter()
			.append('rect')
			.attr('class', 'cdu-bar')
			.attr('x', (d) => x(-d.cduBroken))
			.attr('y', (d) => y(d.area) || 0)
			.attr('width', (d) => x(0) - x(-d.cduBroken))
			.attr('height', y.bandwidth())
			.attr('fill', '#000000')
			.attr('opacity', 0.8);

		// SPD bars (right side, positive)
		svg
			.selectAll('.spd-bar')
			.data(policyAreas)
			.enter()
			.append('rect')
			.attr('class', 'spd-bar')
			.attr('x', x(0))
			.attr('y', (d) => y(d.area) || 0)
			.attr('width', (d) => x(d.spdBroken) - x(0))
			.attr('height', y.bandwidth())
			.attr('fill', '#E3000F')
			.attr('opacity', 0.8);

		// Labels
		svg
			.selectAll('.cdu-label')
			.data(policyAreas.filter((d) => d.cduBroken > 0))
			.enter()
			.append('text')
			.attr('class', 'cdu-label')
			.attr('x', (d) => x(-d.cduBroken / 2))
			.attr('y', (d) => (y(d.area) || 0) + y.bandwidth() / 2 + 5)
			.attr('text-anchor', 'middle')
			.style('font-size', '12px')
			.style('font-weight', 'bold')
			.style('fill', 'white')
			.text((d) => d.cduBroken);

		svg
			.selectAll('.spd-label')
			.data(policyAreas.filter((d) => d.spdBroken > 0))
			.enter()
			.append('text')
			.attr('class', 'spd-label')
			.attr('x', (d) => x(d.spdBroken / 2))
			.attr('y', (d) => (y(d.area) || 0) + y.bandwidth() / 2 + 5)
			.attr('text-anchor', 'middle')
			.style('font-size', '12px')
			.style('font-weight', 'bold')
			.style('fill', 'white')
			.text((d) => d.spdBroken);

		// Legend
		const legend = svg.append('g').attr('transform', `translate(${width - 120}, -10)`);

		legend
			.append('rect')
			.attr('x', 0)
			.attr('y', 0)
			.attr('width', 20)
			.attr('height', 15)
			.attr('fill', '#000000')
			.attr('opacity', 0.8);
		legend.append('text').attr('x', 25).attr('y', 12).text('CDU/CSU').style('font-size', '11px');

		legend
			.append('rect')
			.attr('x', 0)
			.attr('y', 20)
			.attr('width', 20)
			.attr('height', 15)
			.attr('fill', '#E3000F')
			.attr('opacity', 0.8);
		legend.append('text').attr('x', 25).attr('y', 32).text('SPD').style('font-size', '11px');

		// Title
		svg
			.append('text')
			.attr('x', width / 2)
			.attr('y', -15)
			.attr('text-anchor', 'middle')
			.style('font-size', '16px')
			.style('font-weight', 'bold')
			.text('Broken Promises by Policy Area');

		// X axis label
		svg
			.append('text')
			.attr('x', width / 2)
			.attr('y', height + 40)
			.attr('text-anchor', 'middle')
			.style('font-size', '12px')
			.text('← CDU/CSU Broken | SPD Broken →');
	}

	function createFulfillmentGaugeChart() {
		const width = 500;
		const height = 400;
		const margin = { top: 60, right: 20, bottom: 40, left: 20 };

		const svg = d3
			.select('#fulfillment-gauge')
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.append('g')
			.attr('transform', `translate(${width / 2},${height / 2 + 20})`);

		// Calculate fulfillment rates
		const cduTotal = 8;
		const cduFulfilled = 1 + 1; // exceeded + partial
		const cduRate = (cduFulfilled / cduTotal) * 100;

		const spdTotal = 10;
		const spdFulfilled = 1 + 1; // exceeded + partial
		const spdRate = (spdFulfilled / spdTotal) * 100;

		const gauges = [
			{ party: 'CDU/CSU', rate: cduRate, x: -120, color: '#000000' },
			{ party: 'SPD', rate: spdRate, x: 120, color: '#E3000F' }
		];

		gauges.forEach(({ party, rate, x, color }) => {
			const g = svg.append('g').attr('transform', `translate(${x}, 0)`);

			const radius = 80;
			const arc = d3
				.arc()
				.innerRadius(radius - 20)
				.outerRadius(radius)
				.startAngle(-Math.PI / 2)
				.endAngle((rate / 100) * Math.PI - Math.PI / 2);

			const backgroundArc = d3
				.arc()
				.innerRadius(radius - 20)
				.outerRadius(radius)
				.startAngle(-Math.PI / 2)
				.endAngle(Math.PI / 2);

			// Background
			g.append('path')
				.attr('d', backgroundArc as any)
				.attr('fill', '#e0e0e0');

			// Foreground
			g.append('path')
				.attr('d', arc as any)
				.attr('fill', color);

			// Center text
			g.append('text')
				.attr('text-anchor', 'middle')
				.attr('y', -10)
				.style('font-size', '24px')
				.style('font-weight', 'bold')
				.style('fill', color)
				.text(Math.round(rate) + '%');

			g.append('text')
				.attr('text-anchor', 'middle')
				.attr('y', 10)
				.style('font-size', '12px')
				.style('fill', '#666')
				.text('fulfilled');

			// Party label
			g.append('text')
				.attr('text-anchor', 'middle')
				.attr('y', 100)
				.style('font-size', '14px')
				.style('font-weight', 'bold')
				.text(party);
		});

		// Title
		svg
			.append('text')
			.attr('x', 0)
			.attr('y', -height / 2 + 10)
			.attr('text-anchor', 'middle')
			.style('font-size', '16px')
			.style('font-weight', 'bold')
			.text('Overall Promise Fulfillment Rate');
	}

	function createRedLinesChart() {
		const margin = { top: 40, right: 30, bottom: 60, left: 200 };
		const width = 700 - margin.left - margin.right;
		const height = 350 - margin.top - margin.bottom;

		const svg = d3
			.select('#red-lines-chart')
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		const y = d3
			.scaleBand()
			.domain(redLines.map((d) => d.redline))
			.range([0, height])
			.padding(0.3);

		const x = d3.scaleLinear().domain([0, 1]).range([0, width]);

		// Y axis
		svg.append('g').call(d3.axisLeft(y)).selectAll('text').style('font-size', '11px');

		// Bars
		svg
			.selectAll('rect')
			.data(redLines)
			.enter()
			.append('rect')
			.attr('x', 0)
			.attr('y', (d) => y(d.redline) || 0)
			.attr('width', (d) => (d.broken ? x(1) : x(0)))
			.attr('height', y.bandwidth())
			.attr('fill', (d) => (d.party === 'CDU' ? '#000000' : '#E3000F'))
			.attr('opacity', 0.8);

		// Status icons
		svg
			.selectAll('.status-icon')
			.data(redLines)
			.enter()
			.append('text')
			.attr('class', 'status-icon')
			.attr('x', width - 30)
			.attr('y', (d) => (y(d.redline) || 0) + y.bandwidth() / 2 + 6)
			.attr('text-anchor', 'middle')
			.style('font-size', '20px')
			.text('✗')
			.style('fill', '#fff');

		// Title
		svg
			.append('text')
			.attr('x', width / 2)
			.attr('y', -15)
			.attr('text-anchor', 'middle')
			.style('font-size', '16px')
			.style('font-weight', 'bold')
			.text('Broken "Red Line" Promises');

		// Subtitle
		svg
			.append('text')
			.attr('x', width / 2)
			.attr('y', height + 35)
			.attr('text-anchor', 'middle')
			.style('font-size', '11px')
			.style('fill', '#666')
			.text('Core campaign promises that parties declared non-negotiable');
	}

	function createDetailedComparisonChart() {
		const margin = { top: 40, right: 30, bottom: 80, left: 150 };
		const width = 700 - margin.left - margin.right;
		const height = 400 - margin.top - margin.bottom;

		const svg = d3
			.select('#detailed-comparison')
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		const y = d3
			.scaleBand()
			.domain(detailedComparison.map((d) => d.category))
			.range([0, height])
			.padding(0.2);

		const x = d3.scaleLinear().domain([0, 150]).range([0, width]);

		// Y axis
		svg.append('g').call(d3.axisLeft(y));

		// X axis
		svg
			.append('g')
			.attr('transform', `translate(0,${height})`)
			.call(
				d3
					.axisBottom(x)
					.ticks(8)
					.tickFormat((d) => d + '%')
			);

		// 100% reference line
		svg
			.append('line')
			.attr('x1', x(100))
			.attr('x2', x(100))
			.attr('y1', 0)
			.attr('y2', height)
			.attr('stroke', '#3498db')
			.attr('stroke-width', 2)
			.attr('stroke-dasharray', '5,5');

		svg
			.append('text')
			.attr('x', x(100))
			.attr('y', -5)
			.attr('text-anchor', 'middle')
			.style('font-size', '10px')
			.style('fill', '#3498db')
			.text('Full fulfillment');

		// Bars
		svg
			.selectAll('rect')
			.data(detailedComparison)
			.enter()
			.append('rect')
			.attr('x', 0)
			.attr('y', (d) => y(d.category) || 0)
			.attr('width', (d) => x(d.fulfillment))
			.attr('height', y.bandwidth())
			.attr('fill', (d) => {
				if (d.fulfillment >= 100) return '#27ae60';
				if (d.fulfillment >= 50) return '#f39c12';
				return '#e74c3c';
			});

		// Labels
		svg
			.selectAll('.label')
			.data(detailedComparison)
			.enter()
			.append('text')
			.attr('x', (d) => x(d.fulfillment) + 5)
			.attr('y', (d) => (y(d.category) || 0) + y.bandwidth() / 2 + 5)
			.style('font-size', '11px')
			.style('font-weight', 'bold')
			.text((d) => d.fulfillment + '%');

		// Title
		svg
			.append('text')
			.attr('x', width / 2)
			.attr('y', -15)
			.attr('text-anchor', 'middle')
			.style('font-size', '16px')
			.style('font-weight', 'bold')
			.text('Promise Fulfillment Rate by Policy Category');
	}

	function createPromiseBreakdownChart() {
		const width = 600;
		const height = 500;
		const radius = Math.min(width, height) / 2 - 40;

		const svg = d3
			.select('#promise-breakdown')
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.append('g')
			.attr('transform', `translate(${width / 2},${height / 2})`);

		// CDU data
		const cduData = [
			{ status: 'Broken', count: 4 },
			{ status: 'Delayed', count: 2 },
			{ status: 'Partial', count: 1 },
			{ status: 'Exceeded', count: 1 }
		];

		// SPD data
		const spdData = [
			{ status: 'Broken', count: 8 },
			{ status: 'Partial', count: 1 },
			{ status: 'Exceeded', count: 1 }
		];

		const color = d3
			.scaleOrdinal()
			.domain(['Broken', 'Delayed', 'Partial', 'Exceeded'])
			.range(['#e74c3c', '#e67e22', '#f39c12', '#27ae60']);

		// Create two pie charts side by side
		createPie(svg, cduData, -160, 'CDU/CSU');
		createPie(svg, spdData, 160, 'SPD');

		function createPie(g: any, data: any[], xOffset: number, party: string) {
			const pieG = g.append('g').attr('transform', `translate(${xOffset}, 0)`);

			const pie = d3
				.pie<any>()
				.value((d: any) => d.count)
				.sort(null);

			const arc = d3
				.arc<any>()
				.innerRadius(0)
				.outerRadius(radius / 2);

			const arcs = pieG.selectAll('.arc').data(pie(data)).enter().append('g').attr('class', 'arc');

			arcs
				.append('path')
				.attr('d', arc)
				.attr('fill', (d: any) => color(d.data.status) as string)
				.attr('stroke', 'white')
				.attr('stroke-width', 2);

			// Labels
			arcs
				.append('text')
				.attr('transform', (d: any) => `translate(${arc.centroid(d)})`)
				.attr('text-anchor', 'middle')
				.style('font-size', '12px')
				.style('font-weight', 'bold')
				.style('fill', 'white')
				.text((d: any) => d.data.count);

			// Party label
			pieG
				.append('text')
				.attr('y', radius / 2 + 25)
				.attr('text-anchor', 'middle')
				.style('font-size', '14px')
				.style('font-weight', 'bold')
				.text(party);
		}

		// Legend
		const legend = svg.append('g').attr('transform', `translate(-100, ${radius / 2 + 60})`);

		['Broken', 'Delayed', 'Partial', 'Exceeded'].forEach((status, i) => {
			const legendRow = legend.append('g').attr('transform', `translate(${i * 110}, 0)`);

			legendRow
				.append('rect')
				.attr('width', 15)
				.attr('height', 15)
				.attr('fill', color(status) as string);

			legendRow.append('text').attr('x', 20).attr('y', 12).style('font-size', '11px').text(status);
		});

		// Title
		svg
			.append('text')
			.attr('x', 0)
			.attr('y', -radius / 2 - 30)
			.attr('text-anchor', 'middle')
			.style('font-size', '16px')
			.style('font-weight', 'bold')
			.text('Promise Breakdown by Party');
	}
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
	<div class="mx-auto max-w-7xl">
		<!-- Header -->
		<div class="mb-12 text-center">
			<h1 class="mb-4 text-5xl font-bold text-slate-800">Campaign Promises vs Reality</h1>
			<p class="text-xl text-slate-600">
				Tracking how CDU/CSU and SPD delivered on their 2025 election commitments
			</p>
			<p class="mt-2 text-sm text-slate-500">
				Based on coalition agreement (April 2025) and implementation status (November 2025)
			</p>
		</div>

		<!-- Summary Cards -->
		<div class="mb-12 grid grid-cols-1 gap-6 md:grid-cols-4">
			<div class="rounded-lg border-l-4 border-red-500 bg-white p-6 shadow-lg">
				<div class="text-3xl font-bold text-red-600">12</div>
				<div class="text-sm text-slate-600">Broken Promises</div>
				<div class="mt-1 text-xs text-slate-500">Major commitments not delivered</div>
			</div>
			<div class="rounded-lg border-l-4 border-orange-500 bg-white p-6 shadow-lg">
				<div class="text-3xl font-bold text-orange-600">2</div>
				<div class="text-sm text-slate-600">Delayed Promises</div>
				<div class="mt-1 text-xs text-slate-500">Implementation postponed</div>
			</div>
			<div class="rounded-lg border-l-4 border-yellow-500 bg-white p-6 shadow-lg">
				<div class="text-3xl font-bold text-yellow-600">2</div>
				<div class="text-sm text-slate-600">Partial Fulfillment</div>
				<div class="mt-1 text-xs text-slate-500">Watered down versions</div>
			</div>
			<div class="rounded-lg border-l-4 border-green-500 bg-white p-6 shadow-lg">
				<div class="text-3xl font-bold text-green-600">2</div>
				<div class="text-sm text-slate-600">Exceeded Promises</div>
				<div class="mt-1 text-xs text-slate-500">Surpassed commitments</div>
			</div>
		</div>

		<!-- Red Lines Alert -->
		<div class="mb-8 rounded-lg border-2 border-red-300 bg-red-50 p-6">
			<div class="flex items-start">
				<div class="mr-4 text-4xl">⚠️</div>
				<div>
					<h3 class="mb-2 text-xl font-bold text-red-800">All "Red Line" Promises Broken</h3>
					<p class="text-red-700">
						Both CDU and SPD failed to deliver on their core, non-negotiable campaign promises. The
						SPD's 48% pension guarantee and €15 minimum wage - both declared as "red lines" - were
						abandoned in coalition negotiations. The CDU's signature promise to abolish Bürgergeld
						also failed, with the system merely frozen instead.
					</p>
				</div>
			</div>
		</div>

		<!-- Charts Grid -->
		<div class="grid grid-cols-1 gap-8 xl:grid-cols-2">
			<!-- Promise Status by Party -->
			<div class="rounded-lg bg-white p-6 shadow-lg">
				<div id="promise-status-chart" class="flex justify-center"></div>
				<p class="mt-4 text-sm text-slate-600">
					<strong>CDU/CSU:</strong> 50% broken (4/8), while <strong>SPD:</strong> 80% broken (8/10).
					Both parties only exceeded expectations on defense spending.
				</p>
			</div>

			<!-- Promise Breakdown Pies -->
			<div class="rounded-lg bg-white p-6 shadow-lg">
				<div id="promise-breakdown" class="flex justify-center"></div>
				<p class="mt-4 text-sm text-slate-600">
					SPD has the worst record with 80% broken promises. CDU performed slightly better at 50%,
					but still failed on core welfare and immigration pledges.
				</p>
			</div>

			<!-- Policy Area Breakdown -->
			<div class="rounded-lg bg-white p-6 shadow-lg">
				<div id="policy-area-chart" class="flex justify-center"></div>
				<p class="mt-4 text-sm text-slate-600">
					Climate policy saw the most broken promises (3 by SPD), followed by education. Both
					parties share blame across multiple policy areas.
				</p>
			</div>

			<!-- Fulfillment Gauge -->
			<div class="rounded-lg bg-white p-6 shadow-lg">
				<div id="fulfillment-gauge" class="flex justify-center"></div>
				<p class="mt-4 text-sm text-slate-600">
					Overall fulfillment rates: CDU/CSU at 25%, SPD at 20%. These rates include only fully
					exceeded or partially fulfilled promises.
				</p>
			</div>

			<!-- Detailed Comparison -->
			<div class="col-span-1 rounded-lg bg-white p-6 shadow-lg xl:col-span-2">
				<div id="detailed-comparison" class="flex justify-center"></div>
				<p class="mt-4 text-sm text-slate-600">
					Defense spending (150%) is the only area exceeding promises. Climate neutrality (40%),
					pension levels (10%), and renewable energy (0%) show massive shortfalls.
				</p>
			</div>

			<!-- Red Lines Chart -->
			<div class="col-span-1 rounded-lg bg-white p-6 shadow-lg xl:col-span-2">
				<div id="red-lines-chart" class="flex justify-center"></div>
				<p class="mt-4 text-sm text-slate-600">
					All five "red line" promises - the absolute non-negotiables declared by both parties -
					were broken in coalition negotiations. This represents complete failure on core
					commitments.
				</p>
			</div>
		</div>

		<!-- Detailed Promise Tables -->
		<div class="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
			<!-- CDU/CSU Promises -->
			<div class="rounded-lg bg-white p-6 shadow-lg">
				<h3 class="mb-4 text-xl font-bold text-slate-800">CDU/CSU Campaign Promises</h3>
				<div class="space-y-3">
					{#each cduPromises as promise}
						<div
							class="border-l-4 p-3 {promise.status === 'exceeded'
								? 'border-green-500 bg-green-50'
								: promise.status === 'partial'
									? 'border-yellow-500 bg-yellow-50'
									: promise.status === 'delayed'
										? 'border-orange-500 bg-orange-50'
										: 'border-red-500 bg-red-50'}"
						>
							<div class="flex items-start justify-between">
								<div class="flex-1">
									<div class="mb-1 text-xs font-semibold text-slate-500">{promise.area}</div>
									<div class="font-semibold text-slate-700">{promise.promise}</div>
									<div class="mt-1 text-sm text-slate-600">→ {promise.result}</div>
								</div>
								<div class="ml-3 text-2xl">
									{#if promise.status === 'exceeded'}✓
									{:else if promise.status === 'partial'}◐
									{:else if promise.status === 'delayed'}⏳
									{:else}✗
									{/if}
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- SPD Promises -->
			<div class="rounded-lg bg-white p-6 shadow-lg">
				<h3 class="mb-4 text-xl font-bold text-slate-800">SPD Campaign Promises</h3>
				<div class="space-y-3">
					{#each spdPromises as promise}
						<div
							class="border-l-4 p-3 {promise.status === 'exceeded'
								? 'border-green-500 bg-green-50'
								: promise.status === 'partial'
									? 'border-yellow-500 bg-yellow-50'
									: promise.status === 'delayed'
										? 'border-orange-500 bg-orange-50'
										: 'border-red-500 bg-red-50'}"
						>
							<div class="flex items-start justify-between">
								<div class="flex-1">
									<div class="mb-1 text-xs font-semibold text-slate-500">{promise.area}</div>
									<div class="font-semibold text-slate-700">{promise.promise}</div>
									<div class="mt-1 text-sm text-slate-600">→ {promise.result}</div>
								</div>
								<div class="ml-3 text-2xl">
									{#if promise.status === 'exceeded'}✓
									{:else if promise.status === 'partial'}◐
									{:else if promise.status === 'delayed'}⏳
									{:else}✗
									{/if}
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Key Insights -->
		<div class="mt-12 rounded-lg bg-white p-8 shadow-lg">
			<h2 class="mb-6 text-2xl font-bold text-slate-800">Key Insights: The Promise Gap</h2>
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<div>
					<h3 class="mb-3 font-bold text-red-700">Major Failures</h3>
					<ul class="space-y-2 text-sm text-slate-700">
						<li class="flex items-start">
							<span class="mr-2 text-red-500">✗</span>
							<span
								><strong>SPD's Climate Retreat:</strong> Abandoned 65% emissions cut by 2030, 75% renewable
								energy, and 2030 coal phase-out</span
							>
						</li>
						<li class="flex items-start">
							<span class="mr-2 text-red-500">✗</span>
							<span
								><strong>SPD's Red Lines:</strong> Failed on 48% pension guarantee and €15 minimum wage
								- both declared non-negotiable</span
							>
						</li>
						<li class="flex items-start">
							<span class="mr-2 text-red-500">✗</span>
							<span
								><strong>CDU's Welfare Promise:</strong> Bürgergeld frozen, not abolished - core campaign
								pledge broken</span
							>
						</li>
						<li class="flex items-start">
							<span class="mr-2 text-red-500">✗</span>
							<span
								><strong>CDU's Immigration Retreat:</strong> "De facto freeze" became "coordinated EU
								approach"</span
							>
						</li>
					</ul>
				</div>
				<div>
					<h3 class="mb-3 font-bold text-green-700">Exceeded Expectations</h3>
					<ul class="space-y-2 text-sm text-slate-700">
						<li class="flex items-start">
							<span class="mr-2 text-green-500">✓</span>
							<span
								><strong>Defense Spending:</strong> 5% GDP by 2029 vs promised 2% - 150% over-delivery</span
							>
						</li>
						<li class="flex items-start">
							<span class="mr-2 text-green-500">✓</span>
							<span
								><strong>Constitutional Reform:</strong> Debt brake reformed to enable €500B infrastructure
								fund</span
							>
						</li>
					</ul>
					<h3 class="mb-3 mt-6 font-bold text-orange-700">Partial Wins</h3>
					<ul class="space-y-2 text-sm text-slate-700">
						<li class="flex items-start">
							<span class="mr-2 text-yellow-500">◐</span>
							<span
								><strong>Immigration:</strong> SPD blocked extreme measures, but tightened controls implemented</span
							>
						</li>
						<li class="flex items-start">
							<span class="mr-2 text-yellow-500">◐</span>
							<span
								><strong>Care Costs:</strong> SPD's €1,000 cap under study but not legislated</span
							>
						</li>
					</ul>
				</div>
			</div>

			<div class="mt-8 border-t pt-6">
				<h3 class="mb-3 font-bold text-slate-800">The Pattern</h3>
				<p class="leading-relaxed text-slate-700">
					The data reveals a clear pattern: <strong
						>both parties delivered on security/defense but failed on domestic transformation.</strong
					>
					The coalition prioritized fiscal stability and defense spending over social welfare, climate
					action, and economic reform. Most tellingly,
					<strong>every single "red line" promise was broken</strong> - suggesting coalition compromises
					forced both parties to abandon their core commitments. This mirrors the previous government's
					pattern: objective policy achievements (64% fulfillment 2021-2024) contrasted with public perception
					of failure, driving coalition satisfaction from 52% (2021) to 22% (Sep 2025) in just over three
					years.
				</p>
			</div>
		</div>

		<!-- Footer -->
		<div class="mt-8 text-center text-sm text-slate-500">
			<p>
				Data compiled from campaign manifestos, coalition agreement (April 2025), and implementation
				tracking (November 2025)
			</p>
			<p class="mt-1">Interactive visualizations created with D3.js v7</p>
		</div>
	</div>
</div>

<style>
	:global(body) {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
			sans-serif;
	}
</style>
