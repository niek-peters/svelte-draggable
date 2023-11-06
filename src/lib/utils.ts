import { get } from 'svelte/store';
import { dragging } from './stores/dragging';

export function start(e: DragEvent | TouchEvent, el?: HTMLElement) {
	if (e instanceof DragEvent) {
		const canvas = document.createElement('canvas');

		const dataTransfer = e.dataTransfer;
		if (!dataTransfer) throw new Error('Unexpected error');

		dataTransfer.effectAllowed = 'move';
		dataTransfer.setDragImage(canvas, 0, 0);

		canvas.remove();
	}

	if (el === undefined) el = e.currentTarget as HTMLElement;
	dragging.bind(el, e);
}

let lastMousePos = { x: 0, y: 0 };

export function drag(e: DragEvent | TouchEvent) {
	dragging.update((store) => {
		if (!store) return store;

		const mousePos = getMousePos(e);
		if (mousePos.x && mousePos.y) lastMousePos = mousePos;

		if (
			window.innerHeight < document.documentElement.scrollHeight ||
			window.innerWidth < document.documentElement.scrollWidth
		) {
			const scrollProximity = 50;

			const up =
				lastMousePos.y < scrollProximity
					? -1
					: lastMousePos.y > window.innerHeight - scrollProximity
						? 1
						: 0;
			const left =
				lastMousePos.x < scrollProximity
					? -1
					: lastMousePos.x > window.innerWidth - scrollProximity
						? 1
						: 0;

			if (
				store.scrolling &&
				((up === 0 && left === 0) || up !== store.scrolling.up || left !== store.scrolling.left)
			)
				stopScrolling();
			else if (!store.scrolling) startScrolling(100, up, left);
		}

		store.pos = {
			x: lastMousePos.x - store.offset.x,
			y: lastMousePos.y - store.offset.y
		};

		return store;
	});
}

export function end() {
	dragging.drop();
	dragging.set(false);

	stopScrolling();
}

export function getMousePos(e: MouseEvent | TouchEvent) {
	return {
		x: e instanceof MouseEvent ? e.clientX : e.touches[0].clientX,
		y: e instanceof MouseEvent ? e.clientY : e.touches[0].clientY
	};
}

function startScrolling(speed: number, up: number, left: number) {
	dragging.update((store) => {
		if (!store) return store;

		store.scrolling = {
			up,
			left
		};
		return store;
	});

	const dy = (up * document.documentElement.scrollHeight) / (6000 / speed);
	const dx = (left * document.documentElement.scrollWidth) / (6000 / speed);

	const stop = setInterval(() => {
		const store = get(dragging);
		if (store && store.scrolling) window.scrollBy(dx, dy);
		else clearInterval(stop);
	}, 1000 / 60);
}

function stopScrolling() {
	dragging.update((store) => {
		if (!store) return store;

		store.scrolling = false;
		return store;
	});
}
