/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Writable } from "svelte/store";

export type List<T> = {
	uid: string;
	store: Writable<T[]>;
	get: (index: number) => T;
	getIndex: (uid: string) => number | undefined;
};

export type Lists = {
	subscribe: Writable<List<any>[]>['subscribe'];
	add: (newList: List<any>) => void;
	getStore: (uid: string) => List<any> | undefined;
	getIndex: (group_uid: string, uid: string) => [List<unknown> | undefined, number | undefined];
};

export type Collision = {
	uid: string;
	group_uid: string;
	element: HTMLElement;
};


export type Dragging =
	| {
		element: HTMLElement;
		dimensions: {
			width: number;
			height: number;
		};
		pos: {
			x: number;
			y: number;
		};
		offset: {
			x: number;
			y: number;
		};
		scrolling:
		| {
			up: number;
			left: number;
		}
		| false;
		targets: HTMLElement[];
	}
	| false;