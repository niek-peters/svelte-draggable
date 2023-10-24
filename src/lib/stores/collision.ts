import { writable } from 'svelte/store';

export const lastCollision = writable<Element | null>(null);
