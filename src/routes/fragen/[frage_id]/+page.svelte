<script lang="ts">
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();

	import { icons } from '@iconify-json/tabler';
	import { getIconData, iconToSVG, iconToHTML, replaceIDs } from '@iconify/utils';


	function renderSVG(iconName:string) {
		// Get content for icon
		const iconData = getIconData(icons, iconName);
		if (!iconData) {
		throw new Error(`Icon "${iconName}" is missing`);
		}

		// Use it to render icon
		const renderData = iconToSVG(iconData, {
			height: '100%',
			width: '100%'
		});

		// Generate SVG string
		let svg = iconToHTML(replaceIDs(renderData.body), renderData.attributes);

		// Log SVG
		return svg;
	}

</script>


<h1>{data.question.text}</h1>

<div class="h-full flex items-center justify-evenly">
	{#each data.question.answers as answer}
			<div class="card bg-secondary text-primary-content w-72 aspect-square hover:shadow-xl  transition-shadow duration-300 cursor-pointer">
				<div class="card-body text-center text-neutral">
					<span class="text-6xl  mx-auto text-primary bg-transparent w-full h-full" >
						{@html renderSVG(answer.icon)}
					</span>
					<h2 class="card-title justify-center text-3xl mt-4 lilita-one-regular">{answer.text}</h2>
				</div>
			</div>
	{/each}
</div>


