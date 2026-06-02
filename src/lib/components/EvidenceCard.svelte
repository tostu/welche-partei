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
	<div class="card bg-base-200 border border-base-300/40 shadow-xl">
		<div class="card-body">
			<h3 class="card-title text-xl text-base-content">
				{evidence.displayName}
				{#if userAnswer}
					<span class="badge badge-primary ml-2 text-primary-content">Ihre Antwort: {userAnswer}</span>
				{/if}
			</h3>

			<!-- Coalition Promises Section -->
			{#if evidence.coalitionPromises.length > 0}
				<div class="mt-4">
					<h4 class="mb-2 font-bold text-base-content/85">Regierungsversprechen (CDU/SPD)</h4>
					<div class="space-y-3">
						{#each evidence.coalitionPromises as promise}
							<div
								class="rounded-lg border-l-4 p-3 {promise.status === 'exceeded'
									? 'border-emerald-500 bg-green-50 text-green-900 shadow-sm'
									: promise.status === 'partial'
										? 'border-amber-500 bg-orange-50 text-orange-950 shadow-sm'
										: promise.status === 'delayed'
											? 'border-sky-500 bg-blue-50 text-blue-900 shadow-sm'
											: 'border-rose-500 bg-red-50 text-red-900 shadow-sm'}"
							>
								<div class="mb-1 flex items-center gap-2">
									<span class="badge badge-sm bg-black/10 border border-black/10 text-slate-800 font-semibold">{promise.party}</span>
									{#if promise.status === 'exceeded'}
										<span class="badge badge-success badge-sm text-green-950 font-bold">Übertroffen</span>
									{:else if promise.status === 'partial'}
										<span class="badge badge-warning badge-sm text-orange-950 font-bold">Teilweise</span>
									{:else if promise.status === 'delayed'}
										<span class="badge badge-info badge-sm text-blue-950 font-bold">Verzögert</span>
									{:else if promise.status === 'broken'}
										<span class="badge badge-error badge-sm text-red-50 font-bold">Gebrochen</span>
									{/if}
									{#if promise.importance === 'high'}
										<span class="text-rose-500">❗</span>
									{/if}
								</div>
								<p class="text-sm">
									<strong>Versprechen:</strong>
									{promise.promise}
								</p>
								<p class="mt-1 text-sm opacity-90">
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
					<h4 class="mb-2 font-bold text-base-content/85">Oppositionsvorschläge</h4>
					<div class="space-y-3">
						{#each evidence.oppositionProposals as proposal}
							<div class="rounded-lg border-l-4 border-purple-500 bg-purple-50 text-purple-900 p-3 shadow-sm">
								<div class="mb-1 flex items-center gap-2">
									<span class="badge badge-sm bg-black/10 border border-black/10 text-slate-800 font-semibold">{proposal.party}</span>
									<span class="badge badge-ghost badge-sm text-purple-950 font-semibold">Kann nicht regieren</span>
									<span class="text-xs text-purple-900"
										>{proposal.voterSupport}% Wählerunterstützung</span
									>
								</div>
								<p class="text-sm">
									<strong>Vorschlag:</strong>
									{proposal.proposal}
								</p>
								<p class="mt-1 text-xs text-purple-800 font-bold">
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
					<h4 class="mb-2 font-bold text-base-content/85">Konkrete Daten</h4>
					<div class="overflow-x-auto">
						<table class="table-compact table w-full">
							<thead>
								<tr class="border-b border-base-300 text-base-content/80">
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
							<tbody class="text-base-content">
								{#each evidence.actualData as data}
									<tr class="border-b border-base-300">
										<td class="font-semibold text-base-content">{data.metric}</td>
										{#if evidence.actualData.some((d) => d.promised)}
											<td class="text-base-content/80">{data.promised || '-'}</td>
										{/if}
										<td class="text-base-content font-bold">{data.actual}</td>
										{#if evidence.actualData.some((d) => d.change)}
											<td
												class={data.change?.startsWith('+') || data.change?.includes('gestiegen')
													? 'text-rose-800 font-bold text-sm'
													: data.change?.startsWith('-') &&
														  !data.change?.includes('Prozentpunkte hinter')
														? 'text-green-800 font-bold text-sm'
														: 'text-base-content/80 text-sm'}
											>
												{data.change || '-'}
											</td>
										{/if}
										<td class="text-xs text-base-content/60">{data.source}</td>
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
	<div class="alert alert-warning bg-amber-50 border border-amber-200 text-amber-900 shadow-sm">
		<span>Keine Daten für Kategorie "{category}" verfügbar</span>
	</div>
{/if}

<style>
	.table {
		font-size: 0.875rem;
	}
</style>
