import { writable } from 'svelte/store';

import { dragListClassName } from '$lib';
import { getMousePos } from '$lib/utils';

import type { Dragging } from '$lib/types';

export const dragging = (() => {
	const store = writable<Dragging>(false);
	let observer: MutationObserver | undefined;

	let onDropFunction: (() => void) | undefined = undefined;

	return {
		subscribe: store.subscribe,
		update: store.update,
		set: store.set,
		bind: (element: HTMLElement, e: DragEvent | TouchEvent) => {
			if (observer !== undefined) observer.disconnect();

			observer = new MutationObserver(() =>
				store.update((store) => {
					if (store === false) return store;

					const { width, height } = element.getBoundingClientRect();
					store.dimensions = { width, height };

					return store;
				})
			);
			observer.observe(element, {
				subtree: true,
				childList: true,
				characterData: true,
				attributes: true
			});

			const mousePos = getMousePos(e);
			const { width, height, x, y } = element.getBoundingClientRect();

			const dataset = element.dataset;
			let targets =
				dataset['inner'] === 'true'
					? Array.from<HTMLElement>(
						document.querySelectorAll(`[data-group_uid="${dataset['group_uid']}"]`)
					)
					: [];

			const data_targets = dataset['targets']?.split(',');

			targets = targets.concat(Array.from<HTMLElement>(
				document.querySelectorAll(`.${dragListClassName}`)
			).filter((el) => data_targets?.includes(el.id)))

			if (data_targets !== undefined) {
				for (const group of data_targets) {
					const group_members = Array.from<HTMLElement>(
						document.querySelectorAll(`[data-group_uid="${group}"]`)
					);

					for (const member of group_members) if (!targets.includes(member)) targets.push(member);
				}
			}

			// targets = targets.filter((target) => target.id !== element.id);

			store.set({
				element,
				dimensions: {
					width,
					height
				},
				pos: {
					x,
					y
				},
				offset: {
					x: mousePos.x - x,
					y: mousePos.y - y
				},
				scrolling: false,
				targets
			});
		},
		onDrop: (f: (() => void) | undefined) => {
			onDropFunction = f;
		},
		drop: () => {
			if (onDropFunction === undefined) return;

			onDropFunction();
			onDropFunction = undefined;
		},
		onDropSet: () => onDropFunction !== undefined
	};
})();
