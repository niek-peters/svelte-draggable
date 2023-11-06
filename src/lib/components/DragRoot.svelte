<script lang="ts">
	import { dragging } from '$lib/stores/dragging';

	import { onMount } from 'svelte';
	import { getMousePos } from '$lib/utils';
	import { dragListClassName, draggableClassName } from '$lib';
	import type { Collision } from '$lib/types';
	import { lists } from '$lib/stores/lists';

	export let swapOnCollision = true;
	export let onCollision = (drag: Collision, hit: Collision) => {};

	function swap(drag: Collision, hit: Collision) {
		const [dragList, dragIndex] = lists.getIndex(drag.group_uid, drag.uid);
		const [hitList, hitIndex] = lists.getIndex(hit.group_uid, hit.uid);

		// Outer list collision
		if (hit.element.classList.contains(dragListClassName)) {
			if (dragList === undefined || dragIndex === undefined) return;

			const hitList = lists.getStore(hit.element.id);
			if (hitList === undefined) return;

			// Inter-list collision
			if (lists.getIndex(hit.group_uid, drag.uid)[1] !== undefined) return;

			dragList.store.update((store) => {
				const temp = store[dragIndex];

				dragging.drop();
				dragging.onDrop(() => {
					dragList.store.update((store) => {
						store.splice(dragIndex, 1);
						return store;
					});
				});

				hitList.store.update((store) => {
					if ($dragging === false) return store;
					$dragging.element.dataset['group_uid'] = hit.element.dataset['group_uid'];
					$dragging.element.dataset['inner'] = hit.element.dataset['inner'];
					$dragging.element.dataset['targets'] = hit.element.dataset['targets'];

					store.push(temp);
					return store;
				});

				return store;
			});

			return true;
		} else if (
			dragList === undefined ||
			dragIndex === undefined ||
			hitList === undefined ||
			hitIndex === undefined
		)
			return;

		// Inter-list self collision
		if (drag.element.id === hit.element.id) {
			const hitList = hit.element.parentElement;
			if (hitList === null || $dragging === false) return;

			// Remove drag from store
			dragList.store.update((store) => {
				store.splice(dragIndex, 1);
				return store;
			});

			$dragging.element.dataset['group_uid'] = hitList.dataset['group_uid'];
			$dragging.element.dataset['inner'] = hitList.dataset['inner'];
			$dragging.element.dataset['targets'] = hitList.dataset['targets'];

			dragging.onDrop(undefined);
		}
		// Same list collision
		else if (drag.group_uid === hit.group_uid) {
			dragList.store.update((store) => {
				const temp = store[dragIndex];

				store[dragIndex] = store[hitIndex];
				store[hitIndex] = temp;

				return store;
			});
		}
		// Inter-list collision
		else {
			dragList.store.update((store) => {
				const temp = store[dragIndex];

				dragging.drop();
				dragging.onDrop(() => {
					dragList.store.update((store) => {
						store.splice(dragIndex, 1);
						return store;
					});
				});

				hitList.store.update((store) => {
					if ($dragging === false) return store;
					$dragging.element.dataset['group_uid'] = hit.element.dataset['group_uid'];
					$dragging.element.dataset['inner'] = hit.element.dataset['inner'];
					$dragging.element.dataset['targets'] = hit.element.dataset['targets'];

					store.splice(hitIndex, 0, temp);
					return store;
				});

				return store;
			});
		}

		return true;
	}

	onMount(() => {
		const move = (e: TouchEvent | DragEvent) => {
			if ($dragging === false) return;

			const pos = getMousePos(e);
			if (pos.x === 0 && pos.y === 0) return;
			let element = document.elementFromPoint(pos.x, pos.y);

			// get parent element if element is a child of a draggable or list
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
					const drag = {
						uid: $dragging.element.id,
						group_uid: $dragging.element.dataset['group_uid'] || 'default',
						element: $dragging.element
					};

					const hit = {
						uid: target.id,
						group_uid: target.dataset['group_uid'] || 'default',
						element: target
					};

					if (swapOnCollision) {
						const change = swap(drag, hit);
						if (change) onCollision(drag, hit);
					} else onCollision(drag, hit);

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
