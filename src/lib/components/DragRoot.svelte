<script lang="ts">
	import { targets } from '$lib/stores/targets';
	import { dragging } from '$lib/stores/dragging';
	import { hover } from '$lib/stores/hover';

	import { onMount } from 'svelte';
	import { getMousePos } from '$lib/utils';
	import { draggableClassName } from '$lib';
	import type { Collision } from '$lib/types';

	export let onCollision: (drag: Collision, target: Collision) => void = () => {};

	function simulate_hover(el: HTMLElement) {
		if ($hover === undefined) return;

		const child = el.children.item(0) as HTMLElement | null;
		if (!child) return;

		if ($hover.class) child.classList.add($hover.class);
		if ($hover.style) child.style.cssText += $hover.style;
	}

	onMount(() => {
		targets.update();

		let lastTouched: Element | undefined = undefined;
		const move = (e: TouchEvent | DragEvent) => {
			if ($dragging === false) return;

			const pos = getMousePos(e);
			let element = document.elementFromPoint(pos.x, pos.y);

			// get parent element if element is a child of a draggable
			while (element !== null && !element.classList.contains(draggableClassName))
				element = element.parentElement;

			if (element === null || !element.classList.contains(draggableClassName))
				return (lastTouched = undefined);

			for (const target of $dragging.targets)
				if (element === target && lastTouched !== target) {
					onCollision(
						{
							uid: $dragging.element.id,
							group_uid: $dragging.element.dataset['group_uid'] || 'default',
							element: $dragging.element
						},
						{
							uid: target.id,
							group_uid: target.dataset['group_uid'] || 'default',
							element: target
						}
					);

					lastTouched = target;

					break;
				}
		};

		document.addEventListener('touchmove', move);
		document.addEventListener('drag', move);
	});
</script>

{#if $dragging}
	<div
		use:simulate_hover
		style="position: fixed; z-index: 15; width: {$dragging.dimensions.width}px; height: {$dragging
			.dimensions.height}px; left: {$dragging.pos.x}px; top: {$dragging.pos
			.y}px; pointer-events: none;"
	>
		{@html $dragging.element.innerHTML}
	</div>
{/if}
