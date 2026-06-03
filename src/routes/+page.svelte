<script>
	import { onMount } from 'svelte';
	import TextRolling from '$lib/components/TextRolling.svelte';
	onMount(() => (visible = true));

	let visible = $state(false);

	let heroTextList = [
		'Versteht, was mir wichtig ist',
		'Hört mir wirklich zu',
		'Kümmert sich um mein Leben',
		'Setzt meine Interessen an erste Stelle',
		'Macht mein Leben einfacher',
		'Ist auf meiner Seite',
		'Weiß, was wir brauchen',
		'Denkt an unsere Zukunft',
		'Gibt mir Sicherheit und Vertrauen',
		'Löst die Probleme, die wirklich zählen',
		'Bringt uns alle voran',
		'Kämpft für meine Rechte',
		'Verändert, was geändert werden muss',
		'Steht für Gerechtigkeit und Fairness',
		'Hält, was versprochen wird',
		'Weiß, wie man Dinge anpackt',
		'Macht das Land besser für alle',
		'Hält mich nicht für selbstverständlich',
		'Geht den richtigen Weg für uns',
		'Hat eine echte Vision für uns'
	];
</script>

{#if visible}
	<div class="container mx-auto flex flex-1 flex-col justify-center px-4">
		<div class="flex flex-col items-center justify-center gap-y-12 md:gap-y-16">
			<div class="text-center space-y-4">
				<h1 class="lilita-one-regular block text-7xl md:text-9xl text-primary drop-shadow-xl tracking-tight">
					Welche Partei?
				</h1>
				<div class="h-20 md:h-24 flex items-center justify-center">
					<span class="block text-3xl md:text-5xl font-bold text-primary drop-shadow-sm italic">
						<TextRolling textList={heroTextList} />
					</span>
				</div>
			</div>

			<div class="relative group">
				<div class="absolute -inset-1 bg-gradient-to-r from-secondary to-accent rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
				<a href="/fragen" class="relative">
					<button class="btn btn-secondary h-auto py-6 px-10 text-3xl md:text-5xl text-white font-black rounded-2xl shadow-premium hover:shadow-glow-secondary transition-all duration-300 hover:scale-105 active:scale-95">
						Jetzt herausfinden!
					</button>
				</a>
			</div>
			
			<div class="mt-8 text-primary font-bold flex items-center gap-2">
				<span class="icon-[tabler--mouse] h-5 w-5"></span>
				<span>Scrollen für mehr Infos</span>
			</div>
		</div>
	</div>
{/if}
