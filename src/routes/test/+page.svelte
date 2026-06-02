<script lang="ts">
	import { 
		Heart, 
		Briefcase, 
		Plus, 
		Minus, 
		Info, 
		Sparkles, 
		Coffee, 
		Compass, 
		RefreshCw,
		HelpCircle,
		MapPin,
		Coins
	} from 'lucide-svelte';

	// ================= STATE CONFIGURATION =================
	
	// Dilemma Slider (0 = Freizeit-focused, 100 = Karriere-focused)
	let sliderVal = $state(50);
	
	// Budget Allocation (Allocating exactly 5 points among 3 options)
	let points = $state({
		bezahlbarkeit: 2,
		urbanitaet: 2,
		platz_komfort: 1
	});
	
	// Max allowed points in budget
	const TOTAL_BUDGET = 5;
	
	// Derived remaining points
	let allocatedPoints = $derived(points.bezahlbarkeit + points.urbanitaet + points.platz_komfort);
	let remainingPoints = $derived(TOTAL_BUDGET - allocatedPoints);
	
	// Reset inputs to default values
	function resetInputs() {
		sliderVal = 50;
		points.bezahlbarkeit = 2;
		points.urbanitaet = 2;
		points.platz_komfort = 1;
	}

	// Budget helpers
	function addPoint(key: keyof typeof points) {
		if (remainingPoints > 0) {
			points[key]++;
		}
	}

	function removePoint(key: keyof typeof points) {
		if (points[key] > 0) {
			points[key]--;
		}
	}

	// ================= IDEOLOGY CALCULATION MATH =================
	
	// 1. Dilemma Slider Shifts
	// Left (0) = Freizeit -> shifts towards Collective (Social Priority) and State Control (Economic)
	// Right (100) = Karriere -> shifts towards Individual (Social Priority) and Free Market (Economic)
	let sliderShiftMarketState = $derived(((50 - sliderVal) / 50) * 1.5); // Range [-1.5, +1.5]
	let sliderShiftIndividualCollective = $derived(((50 - sliderVal) / 50) * 1.8); // Range [-1.8, +1.8]

	// 2. Budget Allocation Shifts
	// Each point spent on Bezahlbarkeit shifts market-state towards State Control (+0.5 per point relative to start of 2)
	let pointsShiftMarketState = $derived((points.bezahlbarkeit - 2) * 0.7);
	// Each point spent on Urbanität shifts progressive-conservative towards Progressive (-0.6 per point relative to start of 2)
	// and ecology-economy towards Ecology (+0.5 per point relative to start of 2)
	let pointsShiftProgressive = $derived((points.urbanitaet - 2) * -0.8);
	let pointsShiftEcology = $derived((points.urbanitaet - 2) * 0.5);
	// Each point spent on Platz & Komfort shifts individual-collective towards Individual (-0.7 per point relative to start of 1)
	let pointsShiftIndividualCollective = $derived((points.platz_komfort - 1) * -0.8);

	// 3. Final Combined Scores (baseline starts at neutral midpoint 5.5, clamped 1-10)
	let marketStateScore = $derived(Math.max(1, Math.min(10, 5.5 + sliderShiftMarketState + pointsShiftMarketState)));
	let individualCollectiveScore = $derived(Math.max(1, Math.min(10, 5.5 + sliderShiftIndividualCollective + pointsShiftIndividualCollective)));
	let progressiveConservativeScore = $derived(Math.max(1, Math.min(10, 5.5 + pointsShiftProgressive)));
	let ecologyEconomyScore = $derived(Math.max(1, Math.min(10, 5.5 + pointsShiftEcology)));

	// Map coordinates to grid positions (1-10 mapped to 0%-100%)
	// X-axis: market-state (1 = Free Market, 10 = State Control)
	let gridX = $derived(((marketStateScore - 1) / 9) * 100);
	// Y-axis: individual-collective (1 = Individual First, 10 = Collective First)
	// Since 10 is Collective (we want this at the top) and 1 is Individual (bottom), top% = (10 - Y) / 9 * 100
	let gridY = $derived(((10 - individualCollectiveScore) / 9) * 100);

	// Get text evaluation of the coordinates
	let politicalQuadrant = $derived.by(() => {
		if (marketStateScore < 5.0 && individualCollectiveScore < 5.0) {
			return {
				title: 'Libertärer Markt-Individualismus',
				desc: 'Du betonst Eigenverantwortung, Freihandel und eine schlanke Staatsquote bei hoher persönlicher Gestaltungsfreiheit.',
				color: 'text-amber-500 bg-amber-500/10 border-amber-500/20'
			};
		} else if (marketStateScore >= 5.0 && individualCollectiveScore < 5.0) {
			return {
				title: 'Sozialer Staats-Individualismus',
				desc: 'Du unterstützt staatliche Eingriffe zur Absicherung, legst aber großen Wert auf individuelle Rechte und Lebensentwürfe.',
				color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
			};
		} else if (marketStateScore < 5.0 && individualCollectiveScore >= 5.0) {
			return {
				title: 'Konservativer Markt-Kollektivismus',
				desc: 'Du schätzt traditionelle Werte und Gemeinschaftsstrukturen, befürwortest wirtschaftlich jedoch freie Marktentwicklungen.',
				color: 'text-purple-500 bg-purple-500/10 border-purple-500/20'
			};
		} else {
			return {
				title: 'Gemeinschaftlicher Staats-Kollektivismus',
				desc: 'Du setzt auf eine starke solidarische Gemeinschaft und staatliche Steuerung, um soziale Gerechtigkeit für alle zu garantieren.',
				color: 'text-rose-500 bg-rose-500/10 border-rose-500/20'
			};
		}
	});

	// Get descriptions for Slider
	let sliderLabel = $derived.by(() => {
		if (sliderVal < 20) return { title: 'Maximale Erholung & Gesundheit', desc: 'Arbeit ist für dich Mittel zum Zweck; mentale Gesundheit und persönliche Entfaltung stehen kompromisslos an erster Stelle.' };
		if (sliderVal < 45) return { title: 'Fokus auf Work-Life-Balance', desc: 'Du legst Wert auf genügend Freizeit und suchst einen Job, der dich nicht überlastet.' };
		if (sliderVal <= 55) return { title: 'Ausgewogenes Gleichgewicht', desc: 'Du versuchst, Karriereerfolg und Wohlbefinden in einer gesunden Balance zu halten.' };
		if (sliderVal <= 80) return { title: 'Karriere & Aufstiegsorientiert', desc: 'Du bist bereit, Extra-Meilen zu gehen, um finanzielle Sicherheit und berufliche Meilensteine zu erreichen.' };
		return { title: 'Voller Karriere- & Finanzfokus', desc: 'Dein Hauptaugenmerk liegt auf Erfolg und Aufstieg. Dafür nimmst du Überstunden und hohe Belastung in Kauf.' };
	});
</script>

<div class="container mx-auto px-4 py-8 max-w-7xl">
	<!-- Page Header -->
	<div class="mb-10 text-center">
		<h1 class="lilita-one-regular text-5xl md:text-6xl text-neutral tracking-wide drop-shadow-md">
			Alternative UI-Konzepte
		</h1>
		<p class="text-neutral/85 max-w-2xl mx-auto mt-2 text-base md:text-lg">
			Ein interaktiver Prototyp für spielerische, nuancierte Fragenformate. Hier testen wir alternative Steuerungen, die das strategische Taktieren des Nutzers verhindern.
		</p>
		<div class="flex justify-center gap-3 mt-4">
			<a href="/" class="btn btn-outline btn-sm text-neutral border-neutral/30 hover:bg-neutral/10">
				Zurück zum Quiz
			</a>
			<button class="btn btn-secondary btn-sm text-neutral font-semibold" onclick={resetInputs}>
				<RefreshCw class="h-3.5 w-3.5 mr-1" /> Zurücksetzen
			</button>
		</div>
	</div>

	<!-- Main Grid Layout -->
	<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
		
		<!-- LEFT COLUMN: Interactive PoC Playground (8 Cols) -->
		<div class="lg:col-span-7 flex flex-col gap-8">
			
			<!-- CONCEPT 1: Dilemma-Slider -->
			<div class="card bg-white/10 backdrop-blur-md border border-white/10 shadow-2xl text-neutral rounded-2xl overflow-hidden">
				<div class="p-6 bg-gradient-to-r from-primary/30 to-secondary/30 border-b border-white/10 flex justify-between items-center">
					<div class="flex items-center gap-2">
						<span class="badge badge-primary font-bold">PoC 1</span>
						<h2 class="text-xl font-black tracking-wide text-white">Das Regler-Prinzip (Dilemma-Slider)</h2>
					</div>
					<Compass class="h-5 w-5 text-white/70 animate-spin-slow" />
				</div>
				
				<div class="card-body gap-6 p-6">
					<div class="alert alert-info bg-primary/20 border-primary/20 text-neutral text-xs leading-relaxed py-3">
						<Info class="h-4 w-4 shrink-0 text-white" />
						<span>
							<strong>Vorteil:</strong> Keine Textphrasen, die nach Parteiprogramm klingen. Der Nutzer schiebt den Regler intuitiv dorthin, wo sein Bauchgefühl liegt. Nuancen werden perfekt abgefangen.
						</span>
					</div>

					<div class="space-y-4">
						<div class="text-xs font-bold uppercase tracking-wider text-white/50">Szenario & Dilemma</div>
						<p class="text-lg md:text-xl font-bold text-white leading-snug">
							"Dein Job fordert immer mehr Überstunden, aber die Karrierechancen und finanzielle Boni sind dafür exzellent."
						</p>
					</div>

					<!-- Visual Slider Area -->
					<div class="py-8 px-2 bg-black/20 rounded-xl flex flex-col gap-6 relative overflow-hidden">
						<!-- Background glowing indicator depending on slider -->
						<div class="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10 opacity-50 pointer-events-none"></div>
						
						<!-- Extremes Header -->
						<div class="flex justify-between items-stretch gap-4 text-xs font-bold uppercase text-white/70 px-2 select-none z-10">
							<div class="flex flex-col items-start gap-1 w-1/2">
								<span class="text-primary flex items-center gap-1.5">
									<Coffee class="h-3.5 w-3.5 shrink-0" /> Freizeit & Mental Health
								</span>
								<span class="text-[10px] text-white/40 normal-case font-normal text-left">Zeit für Familie, Freunde & Erholung</span>
							</div>
							<div class="flex flex-col items-end gap-1 w-1/2 text-right">
								<span class="text-secondary flex items-center gap-1.5 justify-end">
									Karriere & Finanzen <Briefcase class="h-3.5 w-3.5 shrink-0" />
								</span>
								<span class="text-[10px] text-white/40 normal-case font-normal text-right">Aufstieg, Status & hohes Einkommen</span>
							</div>
						</div>

						<!-- Dynamic Scaling Icons Grid -->
						<div class="flex justify-between items-center px-8 my-2 z-10">
							<!-- Leisure Icon container -->
							<div 
								class="flex items-center justify-center p-3 rounded-full bg-primary/10 border border-primary/20 text-primary transition-all duration-300 shadow-lg shadow-primary/5"
								style="transform: scale({0.85 + ((100 - sliderVal) / 100) * 0.45}); opacity: {0.4 + ((100 - sliderVal) / 100) * 0.6}"
							>
								<Heart class="h-8 w-8 fill-primary/20" />
							</div>

							<!-- Connection Bar with Active Node -->
							<div class="flex-1 h-1.5 mx-4 bg-white/10 rounded-full relative overflow-hidden">
								<div 
									class="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-primary to-secondary transition-all"
									style="width: {sliderVal}%"
								></div>
							</div>

							<!-- Career Icon container -->
							<div 
								class="flex items-center justify-center p-3 rounded-full bg-secondary/10 border border-secondary/20 text-secondary transition-all duration-300 shadow-lg shadow-secondary/5"
								style="transform: scale({0.85 + (sliderVal / 100) * 0.45}); opacity: {0.4 + (sliderVal / 100) * 0.6}"
							>
								<Briefcase class="h-8 w-8 fill-secondary/20" />
							</div>
						</div>

						<!-- Range Input -->
						<div class="px-4 z-10">
							<input 
								type="range" 
								min="0" 
								max="100" 
								bind:value={sliderVal} 
								class="range range-xs [--range-shdw:theme(colors.secondary)]" 
							/>
							<div class="flex justify-between text-[10px] text-white/30 font-mono mt-1">
								<span>100% Freizeit</span>
								<span>Mitte (50/50)</span>
								<span>100% Karriere</span>
							</div>
						</div>
					</div>

					<!-- Dynamic Value Description Box -->
					<div class="p-4 bg-white/5 border border-white/5 rounded-xl flex flex-col gap-1 transition-all">
						<span class="text-[10px] font-bold uppercase tracking-wider text-secondary">Auswertung deiner Gewichtung</span>
						<div class="text-white text-base font-bold flex items-center gap-2">
							<Sparkles class="h-4 w-4 text-accent shrink-0" />
							{sliderLabel.title} 
							<span class="badge badge-sm bg-white/10 text-white border-0 font-mono">{sliderVal}%</span>
						</div>
						<p class="text-xs text-white/70 leading-relaxed mt-1">{sliderLabel.desc}</p>
					</div>
					
					<!-- Live Math Impact -->
					<div class="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-white/5">
						<div class="flex items-center justify-between p-2 bg-black/10 rounded">
							<span class="text-white/60">Wirtschaftlicher Ansatz:</span>
							<span class="font-mono font-bold {sliderShiftMarketState >= 0 ? 'text-primary' : 'text-secondary'}">
								{sliderShiftMarketState >= 0 ? 'Staat' : 'Markt'} ({sliderShiftMarketState >= 0 ? '+' : ''}{sliderShiftMarketState.toFixed(2)})
							</span>
						</div>
						<div class="flex items-center justify-between p-2 bg-black/10 rounded">
							<span class="text-white/60">Soziale Priorität:</span>
							<span class="font-mono font-bold {sliderShiftIndividualCollective >= 0 ? 'text-primary' : 'text-secondary'}">
								{sliderShiftIndividualCollective >= 0 ? 'Kollektiv' : 'Individuum'} ({sliderShiftIndividualCollective >= 0 ? '+' : ''}{sliderShiftIndividualCollective.toFixed(2)})
							</span>
						</div>
					</div>
				</div>
			</div>

			<!-- CONCEPT 2: Budget-Allocation -->
			<div class="card bg-white/10 backdrop-blur-md border border-white/10 shadow-2xl text-neutral rounded-2xl overflow-hidden">
				<div class="p-6 bg-gradient-to-r from-secondary/30 to-accent/30 border-b border-white/10 flex justify-between items-center">
					<div class="flex items-center gap-2">
						<span class="badge badge-secondary text-neutral font-bold">PoC 2</span>
						<h2 class="text-xl font-black tracking-wide text-white">Die Punkte-Priorisierung (Budget-Allokation)</h2>
					</div>
					<Coins class="h-5 w-5 text-white/70" />
				</div>
				
				<div class="card-body gap-6 p-6">
					<div class="alert alert-info bg-primary/20 border-primary/20 text-neutral text-xs leading-relaxed py-3">
						<Info class="h-4 w-4 shrink-0 text-white" />
						<span>
							<strong>Vorteil:</strong> Bildet das echte Leben perfekt ab, weil wir täglich Kompromisse eingehen müssen. Man kann nicht alles gleichzeitig fordern – Prioritäten erfordern Verzicht.
						</span>
					</div>

					<div class="space-y-4">
						<div class="text-xs font-bold uppercase tracking-wider text-white/50">Szenario & Budget</div>
						<p class="text-lg md:text-xl font-bold text-white leading-snug">
							"Du planst deine Lebens- und Wohnsituation für die nächsten 5 Jahre. Verteile dein begrenztes Budget von 5 Punkten auf deine Prioritäten:"
						</p>
					</div>

					<!-- Budget Counter Header -->
					<div class="flex items-center justify-between p-4 bg-gradient-to-r from-black/40 to-black/20 border border-white/10 rounded-xl">
						<div class="flex flex-col">
							<span class="text-xs text-white/60">Verfügbares Budget</span>
							<span class="text-white font-bold text-sm">Politische Gestaltungspunkte</span>
						</div>
						<div class="flex items-center gap-2">
							<!-- Display dots representing points remaining -->
							<div class="flex gap-1">
								{#each Array(TOTAL_BUDGET) as _, i}
									<div 
										class="h-3.5 w-3.5 rounded-full border transition-all duration-300 {i < remainingPoints 
											? 'bg-accent border-accent shadow-md shadow-accent/20 scale-100 animate-pulse' 
											: 'bg-white/10 border-white/20 scale-90'}"
									></div>
								{/each}
							</div>
							<span class="badge badge-lg bg-accent text-neutral border-none font-black text-sm px-3.5 py-3 ml-2">
								{remainingPoints} übrig
							</span>
						</div>
					</div>

					<!-- Allocation Card Stack -->
					<div class="flex flex-col gap-4">
						
						<!-- Item 1: Bezahlbarkeit -->
						<div class="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white/5 border border-white/5 hover:border-white/10 rounded-xl gap-4 transition-all">
							<div class="flex-1 space-y-1">
								<div class="text-white font-bold text-base flex items-center gap-2">
									<span class="badge badge-sm bg-primary/20 text-primary border-none">1</span>
									Bezahlbarkeit
								</div>
								<p class="text-xs text-white/60">Günstige Miete, finanzielle Sorgenfreiheit, Schutz vor Preissteigerung.</p>
							</div>
							
							<div class="flex items-center justify-between md:justify-end gap-4">
								<!-- Visual Dot blocks allocated -->
								<div class="flex gap-1 w-20 justify-center">
									{#each Array(points.bezahlbarkeit) as _}
										<div class="h-2 w-2 rounded bg-primary"></div>
									{/each}
									{#each Array(5 - points.bezahlbarkeit) as _}
										<div class="h-2 w-2 rounded bg-white/5"></div>
									{/each}
								</div>

								<!-- Increment / Decrement Controllers -->
								<div class="join bg-black/40 border border-white/10">
									<button 
										class="btn btn-ghost btn-sm join-item px-2.5 hover:bg-white/5" 
										onclick={() => removePoint('bezahlbarkeit')}
										disabled={points.bezahlbarkeit === 0}
									>
										<Minus class="h-3.5 w-3.5 text-white" />
									</button>
									<span class="join-item bg-transparent text-white font-mono font-bold text-sm w-8 flex items-center justify-center select-none">
										{points.bezahlbarkeit}
									</span>
									<button 
										class="btn btn-ghost btn-sm join-item px-2.5 hover:bg-white/5" 
										onclick={() => addPoint('bezahlbarkeit')}
										disabled={remainingPoints === 0}
									>
										<Plus class="h-3.5 w-3.5 text-white" />
									</button>
								</div>
							</div>
						</div>

						<!-- Item 2: Urbanität -->
						<div class="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white/5 border border-white/5 hover:border-white/10 rounded-xl gap-4 transition-all">
							<div class="flex-1 space-y-1">
								<div class="text-white font-bold text-base flex items-center gap-2">
									<span class="badge badge-sm bg-secondary/20 text-secondary border-none">2</span>
									Urbanität
								</div>
								<p class="text-xs text-white/60">Mitten im Geschehen, kurze Wege, reiche Kultur & Freizeitangebote.</p>
							</div>
							
							<div class="flex items-center justify-between md:justify-end gap-4">
								<!-- Visual Dot blocks allocated -->
								<div class="flex gap-1 w-20 justify-center">
									{#each Array(points.urbanitaet) as _}
										<div class="h-2 w-2 rounded bg-secondary"></div>
									{/each}
									{#each Array(5 - points.urbanitaet) as _}
										<div class="h-2 w-2 rounded bg-white/5"></div>
									{/each}
								</div>

								<!-- Increment / Decrement Controllers -->
								<div class="join bg-black/40 border border-white/10">
									<button 
										class="btn btn-ghost btn-sm join-item px-2.5 hover:bg-white/5" 
										onclick={() => removePoint('urbanitaet')}
										disabled={points.urbanitaet === 0}
									>
										<Minus class="h-3.5 w-3.5 text-white" />
									</button>
									<span class="join-item bg-transparent text-white font-mono font-bold text-sm w-8 flex items-center justify-center select-none">
										{points.urbanitaet}
									</span>
									<button 
										class="btn btn-ghost btn-sm join-item px-2.5 hover:bg-white/5" 
										onclick={() => addPoint('urbanitaet')}
										disabled={remainingPoints === 0}
									>
										<Plus class="h-3.5 w-3.5 text-white" />
									</button>
								</div>
							</div>
						</div>

						<!-- Item 3: Platz & Komfort -->
						<div class="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white/5 border border-white/5 hover:border-white/10 rounded-xl gap-4 transition-all">
							<div class="flex-1 space-y-1">
								<div class="text-white font-bold text-base flex items-center gap-2">
									<span class="badge badge-sm bg-accent/20 text-accent border-none">3</span>
									Platz & Komfort
								</div>
								<p class="text-xs text-white/60">Große Wohnung, Ruhe, Rückzugsort im Grünen, hoher Wohnwert.</p>
							</div>
							
							<div class="flex items-center justify-between md:justify-end gap-4">
								<!-- Visual Dot blocks allocated -->
								<div class="flex gap-1 w-20 justify-center">
									{#each Array(points.platz_komfort) as _}
										<div class="h-2 w-2 rounded bg-accent"></div>
									{/each}
									{#each Array(5 - points.platz_komfort) as _}
										<div class="h-2 w-2 rounded bg-white/5"></div>
									{/each}
								</div>

								<!-- Increment / Decrement Controllers -->
								<div class="join bg-black/40 border border-white/10">
									<button 
										class="btn btn-ghost btn-sm join-item px-2.5 hover:bg-white/5" 
										onclick={() => removePoint('platz_komfort')}
										disabled={points.platz_komfort === 0}
									>
										<Minus class="h-3.5 w-3.5 text-white" />
									</button>
									<span class="join-item bg-transparent text-white font-mono font-bold text-sm w-8 flex items-center justify-center select-none">
										{points.platz_komfort}
									</span>
									<button 
										class="btn btn-ghost btn-sm join-item px-2.5 hover:bg-white/5" 
										onclick={() => addPoint('platz_komfort')}
										disabled={remainingPoints === 0}
									>
										<Plus class="h-3.5 w-3.5 text-white" />
									</button>
								</div>
							</div>
						</div>
					</div>

					<!-- Real-Time Point Allocation Math -->
					<div class="grid grid-cols-3 gap-2 text-[10px] md:text-xs pt-2 border-t border-white/5">
						<div class="flex flex-col items-center justify-center p-2 bg-black/10 rounded text-center">
							<span class="text-white/40 block mb-0.5">Staat-Fokus (Miete)</span>
							<span class="font-mono font-bold text-primary">+{pointsShiftMarketState >= 0 ? '+' : ''}{pointsShiftMarketState.toFixed(1)}</span>
						</div>
						<div class="flex flex-col items-center justify-center p-2 bg-black/10 rounded text-center">
							<span class="text-white/40 block mb-0.5">Progressiv (Urbanität)</span>
							<span class="font-mono font-bold text-secondary">-{Math.abs(pointsShiftProgressive).toFixed(1)}</span>
						</div>
						<div class="flex flex-col items-center justify-center p-2 bg-black/10 rounded text-center">
							<span class="text-white/40 block mb-0.5">Individualität (Platz)</span>
							<span class="font-mono font-bold text-accent">-{Math.abs(pointsShiftIndividualCollective).toFixed(1)}</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- RIGHT COLUMN: Real-Time Political Profiling Dashboard (5 Cols) -->
		<div class="lg:col-span-5 flex flex-col gap-8">
			
			<div class="card bg-slate-900 border border-slate-700 shadow-2xl rounded-2xl overflow-hidden sticky top-6">
				<!-- Header -->
				<div class="p-6 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
					<div class="flex items-center gap-2">
						<Compass class="h-5 w-5 text-accent animate-pulse" />
						<h2 class="text-xl font-bold tracking-wide text-white font-mono">Unter der Haube</h2>
					</div>
					<span class="badge badge-warning font-mono text-xs uppercase tracking-wider">Live Rechner</span>
				</div>
				
				<div class="card-body gap-6 p-6">
					
					<!-- 2D Coordinate Grid -->
					<div>
						<div class="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400 mb-3 text-center">
							Ideologische Positionierung (X/Y-Fläche)
						</div>
						
						<!-- Grid Container -->
						<div class="relative w-full aspect-square border border-slate-700 rounded-xl bg-slate-950 overflow-hidden shadow-inner flex select-none">
							<!-- Quadrant labels under coordinates -->
							<div class="absolute inset-0 grid grid-cols-2 grid-rows-2 text-[9px] leading-tight font-sans text-slate-600 pointer-events-none p-4 text-center">
								<div class="flex flex-col justify-start items-start text-left border-r border-b border-slate-800/40 p-2">
									<span class="font-bold text-amber-500/50">Klassisch-Liberal</span>
									<span class="text-[8px] opacity-40">Markt & Individuum</span>
								</div>
								<div class="flex flex-col justify-start items-end text-right border-b border-slate-800/40 p-2">
									<span class="font-bold text-emerald-500/50">Sozial-Liberal</span>
									<span class="text-[8px] opacity-40">Staat & Individuum</span>
								</div>
								<div class="flex flex-col justify-end items-start text-left border-r border-slate-800/40 p-2">
									<span class="font-bold text-purple-500/50">Gemeinschaft-Markt</span>
									<span class="text-[8px] opacity-40">Markt & Kollektiv</span>
								</div>
								<div class="flex flex-col justify-end items-end text-right p-2">
									<span class="font-bold text-rose-500/50">Demokratisch-Sozial</span>
									<span class="text-[8px] opacity-40">Staat & Kollektiv</span>
								</div>
							</div>

							<!-- Dashed Axes Centerlines (at 5.5 / 50%) -->
							<div class="absolute left-1/2 top-0 bottom-0 border-l border-dashed border-slate-700/60 pointer-events-none"></div>
							<div class="absolute top-1/2 left-0 right-0 border-t border-dashed border-slate-700/60 pointer-events-none"></div>

							<!-- Grid Axis Labels -->
							<div class="absolute bottom-2 left-0 right-0 flex justify-between px-3 text-[9px] font-mono text-slate-500 pointer-events-none">
								<span>← Markt-Orientierung</span>
								<span>Staat-Orientierung →</span>
							</div>
							<div class="absolute top-0 bottom-0 left-2 flex flex-col justify-between py-3 text-[9px] font-mono text-slate-500 pointer-events-none [writing-mode:vertical-lr] rotate-180">
								<span>← Kollektiv & Gemeinschaft</span>
								<span>Individuum Zuerst →</span>
							</div>

							<!-- Pulsing Coordinate Crosshair -->
							<div 
								class="absolute h-6 w-6 rounded-full border-2 border-accent bg-accent/20 flex items-center justify-center transition-all duration-300 shadow-lg shadow-accent/50 -ml-3 -mt-3"
								style="left: {gridX}%; top: {gridY}%;"
							>
								<div class="h-2 w-2 rounded-full bg-accent animate-ping"></div>
							</div>
						</div>
					</div>

					<!-- Live Quadrant Summary -->
					<div class="p-4 rounded-xl border font-sans transition-all {politicalQuadrant.color}">
						<div class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Deine errechnete Tendenz</div>
						<div class="text-base font-bold text-white mt-0.5">{politicalQuadrant.title}</div>
						<p class="text-xs mt-1 text-slate-350 leading-relaxed font-normal">{politicalQuadrant.desc}</p>
					</div>

					<!-- Numerical Axes Outputs -->
					<div class="space-y-4 font-mono text-xs pt-4 border-t border-slate-800">
						<div class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
							Die 4 Politischen Grundachsen
						</div>

						<!-- Axis 1: Market vs State -->
						<div class="space-y-1">
							<div class="flex justify-between text-white text-xs">
								<span>Wirtschaftsansatz:</span>
								<span class="font-bold text-accent">{marketStateScore.toFixed(2)} / 10.0</span>
							</div>
							<div class="flex items-center gap-3">
								<span class="text-[10px] text-slate-500 w-16 text-left truncate">Freier Markt</span>
								<div class="flex-1 h-2.5 rounded-full bg-slate-950 overflow-hidden relative border border-slate-800">
									<div 
										class="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-emerald-500 to-rose-500 transition-all duration-300"
										style="width: {((marketStateScore - 1) / 9) * 100}%"
									></div>
								</div>
								<span class="text-[10px] text-slate-500 w-16 text-right truncate">Staatl. Lenkung</span>
							</div>
						</div>

						<!-- Axis 2: Individual vs Collective -->
						<div class="space-y-1">
							<div class="flex justify-between text-white text-xs">
								<span>Soziale Priorität:</span>
								<span class="font-bold text-accent">{individualCollectiveScore.toFixed(2)} / 10.0</span>
							</div>
							<div class="flex items-center gap-3">
								<span class="text-[10px] text-slate-500 w-16 text-left truncate">Individuum</span>
								<div class="flex-1 h-2.5 rounded-full bg-slate-950 overflow-hidden relative border border-slate-800">
									<div 
										class="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-amber-500 to-teal-500 transition-all duration-300"
										style="width: {((individualCollectiveScore - 1) / 9) * 100}%"
									></div>
								</div>
								<span class="text-[10px] text-slate-500 w-16 text-right truncate">Kollektiv</span>
							</div>
						</div>

						<!-- Axis 3: Progressive vs Conservative -->
						<div class="space-y-1">
							<div class="flex justify-between text-white text-xs">
								<span>Gesellschaftswerte:</span>
								<span class="font-bold text-accent">{progressiveConservativeScore.toFixed(2)} / 10.0</span>
							</div>
							<div class="flex items-center gap-3">
								<span class="text-[10px] text-slate-500 w-16 text-left truncate">Progressiv</span>
								<div class="flex-1 h-2.5 rounded-full bg-slate-950 overflow-hidden relative border border-slate-800">
									<div 
										class="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-violet-500 to-orange-400 transition-all duration-300"
										style="width: {((progressiveConservativeScore - 1) / 9) * 100}%"
									></div>
								</div>
								<span class="text-[10px] text-slate-500 w-16 text-right truncate">Konservativ</span>
							</div>
						</div>

						<!-- Axis 4: Ecology vs Economy -->
						<div class="space-y-1">
							<div class="flex justify-between text-white text-xs">
								<span>Klima / Umwelt:</span>
								<span class="font-bold text-accent">{ecologyEconomyScore.toFixed(2)} / 10.0</span>
							</div>
							<div class="flex items-center gap-3">
								<span class="text-[10px] text-slate-500 w-16 text-left truncate">Ökonomie</span>
								<div class="flex-1 h-2.5 rounded-full bg-slate-950 overflow-hidden relative border border-slate-800">
									<div 
										class="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-yellow-500 to-green-500 transition-all duration-300"
										style="width: {((ecologyEconomyScore - 1) / 9) * 100}%"
									></div>
								</div>
								<span class="text-[10px] text-slate-500 w-16 text-right truncate">Ökologie</span>
							</div>
						</div>
					</div>

					<!-- Extra Info Callout -->
					<div class="p-3.5 bg-slate-800/40 rounded-xl border border-slate-700/50 flex gap-3 text-xs leading-relaxed text-slate-400 font-sans mt-2">
						<HelpCircle class="h-4 w-4 shrink-0 text-accent" />
						<div>
							<strong>Wie funktioniert das?</strong> Jeder Klick und Slider-Verschub verändert mathematische Gewichtungen im Live-Rechner. Im fertigen Quiz würden diese Werte deine Übereinstimmung mit den Parteiprogrammen berechnen, statt starr A, B oder C zu wählen.
						</div>
					</div>
				</div>
			</div>
		</div>

	</div>
</div>

<style>
	/* Animating slow rotation for the compass */
	:global(.animate-spin-slow) {
		animation: spin 15s linear infinite;
	}
	@keyframes spin {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}

	/* Simple animations and visual enhancements */
	.range::-webkit-slider-thumb {
		background-color: theme('colors.neutral');
		border: 3px solid theme('colors.secondary');
		cursor: pointer;
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 9999px;
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
		transition: transform 0.15s ease, background-color 0.15s ease;
	}
	.range::-webkit-slider-thumb:hover {
		transform: scale(1.1);
	}
</style>
