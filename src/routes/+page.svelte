<script>
	import { slide, fade, fly } from 'svelte/transition';
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
		<div transition:slide={{ y: -200, duration: 500 }} class="flex justify-center items-center flex-col gap-y-12">

			<div>
				<h1 class=" lilita-one-regular text-9xl text-neutral  drop-shadow-md block">Welche Partei?</h1>
				<span class="text-5xl text-center drop-shadow block text-base-200">
				<TextRolling textList={heroTextList} />
			</span>
			</div>


			<button class="btn btn-lg btn-secondary text-neutral text-2xl">Jetzt herausfinden!</button>

		</div>



	</div>
{/if}

<style>
    @import url('https://fonts.googleapis.com/css2?family=Lilita+One&family=Modak&display=swap');

    .modak-regular {
        font-family: "Modak", system-ui;
        font-weight: 400;
        font-style: normal;
    }

    .lilita-one-regular {
        font-family: "Lilita One", sans-serif;
        font-weight: 400;
        font-style: normal;
    }



</style>
