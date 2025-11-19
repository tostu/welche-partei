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
	<div class="container mx-auto flex flex-1 flex-col justify-center">
		<div class="flex flex-col items-center justify-center gap-y-16">
			<div class="text-center">
				<h1 class=" lilita-one-regular block text-9xl text-neutral drop-shadow-md">
					Welche Partei?
				</h1>
				<span class="block text-5xl text-base-200 drop-shadow">
					<TextRolling textList={heroTextList} />
				</span>
			</div>

			<a href="/fragen">
				<button class="btn btn-secondary h-full py-5 text-5xl text-neutral"
					>Jetzt herausfinden!</button
				>
			</a>
		</div>
	</div>
{/if}
