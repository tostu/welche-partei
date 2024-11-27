<script>
	import { onMount } from 'svelte';
	import TextRolling from '$lib/components/TextRolling.svelte';

	onMount(() => visible = true);

	let visible = $state(false);


	let heroTextList = [
		"Versteht, was mir wichtig ist",
		"Hört mir wirklich zu",
		"Kümmert sich um mein Leben",
		"Setzt meine Interessen an erste Stelle",
		"Macht mein Leben einfacher",
		"Ist auf meiner Seite",
		"Weiß, was wir brauchen",
		"Denkt an unsere Zukunft",
		"Gibt mir Sicherheit und Vertrauen",
		"Löst die Probleme, die wirklich zählen",
		"Bringt uns alle voran",
		"Kämpft für meine Rechte",
		"Verändert, was geändert werden muss",
		"Steht für Gerechtigkeit und Fairness",
		"Hält, was versprochen wird",
		"Weiß, wie man Dinge anpackt",
		"Macht das Land besser für alle",
		"Hält mich nicht für selbstverständlich",
		"Geht den richtigen Weg für uns",
		"Hat eine echte Vision für uns"
	]


</script>

{#if visible}

	<div class="container mx-auto flex-1 flex justify-center flex-col">
		<div class="flex justify-center items-center flex-col gap-y-16">

			<div class="text-center">
				<h1 class=" lilita-one-regular text-9xl text-neutral  drop-shadow-md block">Welche Partei?</h1>
				<span class="text-5xl  drop-shadow block text-base-200">
				<TextRolling textList={heroTextList} />
			</span>
			</div>

			<a href="/coming_soon">
				<button class="btn h-full py-5 btn-secondary text-neutral text-5xl">Jetzt herausfinden!</button>
			</a>

		</div>
	</div>
{/if}
