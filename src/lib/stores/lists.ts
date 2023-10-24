/* eslint-disable @typescript-eslint/no-explicit-any */
import { get, writable, type Writable } from 'svelte/store';

export type List<T> = {
	uid: string;
	store: Writable<T[]>;
	get: (index: number) => T;
	getIndex: (entry: T) => number | undefined;
};

export type Lists = {
	subscribe: Writable<List<any>[]>['subscribe'];
	add: (newList: List<any>) => void;
	getStore: (uid: string) => List<any> | undefined;
	getIndex: (uid: string, entry: any) => number | undefined;
};

export const lists = initLists();

export function newList<T extends { uid: string }>(uid: string, store: Writable<T[]>): List<T> {
	const listStore: List<T> = {
		uid,
		store,
		get: (index: number) => {
			const list = get(store);
			if (index >= list.length) throw new Error('Index out of bounds');

			return list[index];
		},
		getIndex: (entry: T) => {
			const index = get(store).indexOf(entry);
			return index === -1 ? undefined : index;
		}
	};

	lists.add(listStore);

	return listStore;
}

function initLists(): Lists {
	const store = writable<List<unknown>[]>([]);

	return {
		subscribe: store.subscribe,
		add: (newList: List<unknown>) =>
			store.update((stores) => {
				stores.push(newList);
				return stores;
			}),
		getStore: (uid: string) => get(store).find((l) => l.uid === uid),
		getIndex: (uid: string, entry: unknown) => {
			const list = get(store).find((l) => l.uid === uid);
			if (list === undefined) return undefined;

			return list.getIndex(entry);
		}
	};
}
