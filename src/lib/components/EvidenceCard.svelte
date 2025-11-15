<script lang="ts">
	import { policyEvidence, type Category } from '$lib/policyEvidence';

	export let category: Category;
	export let userAnswer: string = '';

	// Find the evidence for this category
	const evidence = policyEvidence.find((e) => e.category === category);

	if (!evidence) {
		console.warn(`No evidence found for category: ${category}`);
	}
</script>

{#if evidence}
	<div class="card bg-base-100 shadow-xl">
		<div class="card-body">
			<h3 class="card-title text-xl">
				{evidence.displayName}
				{#if userAnswer}
					<span class="badge badge-primary ml-2">Ihre Antwort: {userAnswer}</span>
				{/if}
			</h3>

			<!-- Coalition Promises Section -->
			{#if evidence.coalitionPromises.length > 0}
				<div class="mt-4">
					<h4 class="mb-2 font-bold text-gray-700">Regierungsversprechen (CDU/SPD)</h4>
					<div class="space-y-3">
						{#each evidence.coalitionPromises as promise}
							<div class="rounded-lg border-l-4 p-3 {promise.status === 'exceeded' ? 'border-green-500 bg-green-50' : promise.status === 'partial' ? 'border-orange-500 bg-orange-50' : promise.status === 'delayed' ? 'border-blue-500 bg-blue-50' : 'border-red-500 bg-red-50'}">
								<div class="mb-1 flex items-center gap-2">
									<span class="badge badge-sm">{promise.party}</span>
									{#if promise.status === 'exceeded'}
										<span class="badge badge-success badge-sm">Übertroffen</span>
									{:else if promise.status === 'partial'}
										<span class="badge badge-warning badge-sm">Teilweise</span>
									{:else if promise.status === 'delayed'}
										<span class="badge badge-info badge-sm">Verzögert</span>
									{:else if promise.status === 'broken'}
										<span class="badge badge-error badge-sm">Gebrochen</span>
									{/if}
									{#if promise.importance === 'high'}
										<span class="text-red-600">❗</span>
									{/if}
								</div>
								<p class="text-sm">
									<strong>Versprechen:</strong>
									{promise.promise}
								</p>
								<p class="mt-1 text-sm">
									<strong>Realität:</strong>
									{promise.result}
								</p>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Opposition Proposals Section -->
			{#if evidence.oppositionProposals.length > 0}
				<div class="mt-4">
					<h4 class="mb-2 font-bold text-gray-700">Oppositionsvorschläge</h4>
					<div class="space-y-3">
						{#each evidence.oppositionProposals as proposal}
							<div class="rounded-lg border-l-4 border-purple-500 bg-purple-50 p-3">
								<div class="mb-1 flex items-center gap-2">
									<span class="badge badge-sm">{proposal.party}</span>
									<span class="badge badge-ghost badge-sm">Kann nicht regieren</span>
									<span class="text-xs text-gray-600"
										>{proposal.voterSupport}% Wählerunterstützung</span
									>
								</div>
								<p class="text-sm">
									<strong>Vorschlag:</strong>
									{proposal.proposal}
								</p>
								<p class="mt-1 text-xs text-purple-600">
									⚠️ Benötigt 316 Sitze für Mehrheit - Opposition hat keine Koalitionsoption
								</p>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Actual Data Section -->
			{#if evidence.actualData.length > 0}
				<div class="mt-4">
					<h4 class="mb-2 font-bold text-gray-700">Konkrete Daten</h4>
					<div class="overflow-x-auto">
						<table class="table table-compact w-full">
							<thead>
								<tr>
									<th>Metrik</th>
									{#if evidence.actualData.some((d) => d.promised)}
										<th>Versprochen</th>
									{/if}
									<th>Tatsächlich</th>
									{#if evidence.actualData.some((d) => d.change)}
										<th>Veränderung</th>
									{/if}
									<th>Quelle</th>
								</tr>
							</thead>
							<tbody>
								{#each evidence.actualData as data}
									<tr>
										<td class="font-semibold">{data.metric}</td>
										{#if evidence.actualData.some((d) => d.promised)}
											<td>{data.promised || '-'}</td>
										{/if}
										<td>{data.actual}</td>
										{#if evidence.actualData.some((d) => d.change)}
											<td
												class={data.change?.startsWith('+') || data.change?.includes('gestiegen') ? 'text-red-600' : data.change?.startsWith('-') && !data.change?.includes('Prozentpunkte hinter') ? 'text-green-600' : ''}
											>
												{data.change || '-'}
											</td>
										{/if}
										<td class="text-xs text-gray-500">{data.source}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			{/if}
		</div>
	</div>
{:else}
	<div class="alert alert-warning">
		<span>Keine Daten für Kategorie "{category}" verfügbar</span>
	</div>
{/if}

<style>
	.table {
		font-size: 0.875rem;
	}
</style>
