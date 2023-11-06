import { get, writable, type Writable } from 'svelte/store';

import type { List, Lists } from '$lib/types';

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
		getIndex: (uid: string) => {
			const index = get(store).findIndex((entry) => entry.uid === uid);
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
		getIndex: (group_uid: string, uid: string) => {
			const list = get(store).find((l) => l.uid === group_uid);
			if (list === undefined) return [undefined, undefined];

			return [list, list.getIndex(uid)];
		}
	};
}
