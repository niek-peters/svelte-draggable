<script lang="ts">
	import '../app.css';
	import { writable } from 'svelte/store';
	import { lists, newList } from '$lib/stores/lists';
	import DragList from '$lib/components/DragList.svelte';
	import DragRoot from '$lib/components/DragRoot.svelte';
	import { dragging } from '$lib/stores/dragging';
	import { dragListClassName } from '$lib';

	const list1 = newList(
		'bist',
		writable([
			{ uid: crypto.randomUUID(), name: 'test1' },
			{ uid: crypto.randomUUID(), name: 'test2' },
			{ uid: crypto.randomUUID(), name: 'test3' }
		])
	);

	const list2 = newList(
		'bist2',
		writable([
			{ uid: crypto.randomUUID(), name: 'best1' },
			{ uid: crypto.randomUUID(), name: 'best2' },
			{ uid: crypto.randomUUID(), name: 'best3' }
		])
	);
</script>

<main class="flex gap-16">
	<DragList listClass="flex flex-col" let:index list={list1} targets={['bist2']}>
		{@const entry = list1.get(index)}
		<div
			class="bg-gray-200 w-16 {!$dragging
				? 'hover:bg-gray-300'
				: ''} transition p-2 rounded-sm w-full"
		>
			<p>{entry.name}</p>
		</div>
	</DragList>

	<DragList listClass="flex flex-col w-36 bg-yellow-300" let:index list={list2} targets={['bist']}>
		{@const entry = list2.get(index)}
		<div class="bg-gray-200 w-24 {!$dragging ? 'hover:bg-gray-300' : ''} transition p-2 rounded-sm">
			<p>{entry.name}</p>
		</div>
	</DragList>
</main>

<DragRoot
	onCollision={(drag, hit) => {
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

			return;
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
	}}
/>
