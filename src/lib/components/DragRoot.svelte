<script lang="ts">
	import { dragging } from '$lib/stores/dragging';

	import { onMount } from 'svelte';
	import { getMousePos } from '$lib/utils';
	import { dragListClassName, draggableClassName } from '$lib';
	import type { Collision } from '$lib/types';

	export let onCollision: (drag: Collision, target: Collision) => void = () => {};

	onMount(() => {
		const move = (e: TouchEvent | DragEvent) => {
			if ($dragging === false) return;

			const pos = getMousePos(e);
			if (pos.x === 0 && pos.y === 0) return;
			let element = document.elementFromPoint(pos.x, pos.y);

			// get parent element if element is a child of a draggable
			while (
				element !== null &&
				!element.classList.contains(draggableClassName) &&
				!element.classList.contains(dragListClassName)
			)
				element = element.parentElement;

			for (const target of $dragging.targets)
				if (
					element === target &&
					($dragging.element.id === target.id ? dragging.onDropSet() : true)
				) {
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

					break;
				}
		};

		document.addEventListener('touchmove', move);
		document.addEventListener('drag', move);
	});
</script>

{#if $dragging}
	<div
		style="position: fixed; z-index: 15; width: {$dragging.dimensions.width}px; height: {$dragging
			.dimensions.height}px; left: {$dragging.pos.x}px; top: {$dragging.pos
			.y}px; pointer-events: none;"
	>
		{@html $dragging.element.innerHTML}
	</div>
{/if}
