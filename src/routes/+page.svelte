<script lang="ts">
	import '../app.css';
	import { writable } from 'svelte/store';
	import { newList } from '$lib/stores/lists';
	import DragList from '$lib/components/DragList.svelte';
	import DragRoot from '$lib/components/DragRoot.svelte';
	import { dragging } from '$lib/stores/dragging';

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
			<button class="md:hidden" name="delete">del</button>
			<button class="md:hidden bg-yellow-200" name="drag">drag</button>
			<p>{entry.name}</p>
		</div>
	</DragList>
</main>

<DragRoot />
