<script lang="ts">
	import '../app.css';
	import { writable } from 'svelte/store';
	import { DragList, DragRoot, dragging, isDragged, newList } from '$lib';

	// TODO
	// Add ability to bind:this to DragList
	// Add dragClass and dragStyle props to DragList

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
			{ uid: crypto.randomUUID(), name: 'best3' },
			{ uid: crypto.randomUUID(), name: 'best3' },
			{ uid: crypto.randomUUID(), name: 'best3' },
			{ uid: crypto.randomUUID(), name: 'best3' },
			{ uid: crypto.randomUUID(), name: 'best3' },
			{ uid: crypto.randomUUID(), name: 'best3' },
			{ uid: crypto.randomUUID(), name: 'best3' },
			{ uid: crypto.randomUUID(), name: 'best3' },
			{ uid: crypto.randomUUID(), name: 'best3' },
			{ uid: crypto.randomUUID(), name: 'best3' },
			{ uid: crypto.randomUUID(), name: 'best3' },
			{ uid: crypto.randomUUID(), name: 'best3' },
			{ uid: crypto.randomUUID(), name: 'best3' },
			{ uid: crypto.randomUUID(), name: 'best3' },
			{ uid: crypto.randomUUID(), name: 'best3' },
			{ uid: crypto.randomUUID(), name: 'best3' },
			{ uid: crypto.randomUUID(), name: 'best3' },
			{ uid: crypto.randomUUID(), name: 'best3' },
			{ uid: crypto.randomUUID(), name: 'best3' },
			{ uid: crypto.randomUUID(), name: 'best3' },
			{ uid: crypto.randomUUID(), name: 'best3' },
			{ uid: crypto.randomUUID(), name: 'best3' },
			{ uid: crypto.randomUUID(), name: 'best3' }
		])
	);

	let list1El: HTMLDivElement | undefined;
</script>

<main class="flex gap-16">
	<DragList
		listClass="flex flex-col"
		let:index
		list={list1}
		targets={['bist2']}
		bind:_this={list1El}
	>
		{@const entry = list1.get(index)}
		{@const dragged = isDragged(entry)}
		<div
			class="{!dragged ? 'bg-gray-200' : 'bg-gray-300'} w-16 {!$dragging
				? 'hover:bg-gray-300'
				: ''} transition p-2 rounded-sm w-full"
		>
			<p>{entry.name}</p>
		</div>
	</DragList>

	<DragList
		listClass="flex flex-col h-[110vh] w-1/2 bg-yellow-300"
		let:index
		list={list2}
		targets={['bist']}
	>
		{@const entry = list2.get(index)}
		<div
			class="bg-gray-200 w-full {!$dragging ? 'hover:bg-gray-300' : ''} transition p-2 rounded-sm"
		>
			<button class="md:hidden" name="delete">del</button>
			<button class="md:hidden bg-yellow-200" name="drag">drag</button>
			<p>{entry.name}</p>
		</div>
	</DragList>
</main>

<DragRoot />
