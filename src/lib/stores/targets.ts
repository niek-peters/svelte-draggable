import { draggableClassName } from '$lib';
import { writable } from 'svelte/store';

export const targets = (() => {
	const store = writable<HTMLCollectionOf<Element>>();

	return {
		subscribe: store.subscribe,
		update: () => store.set(document.getElementsByClassName(draggableClassName))
	};
})();
