import { writable } from 'svelte/store';

export const hover = writable<
	| {
			style?: string;
			class?: string;
	  }
	| undefined
>();
