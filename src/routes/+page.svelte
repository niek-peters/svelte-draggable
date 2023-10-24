<script lang="ts">
	import '../app.css';
	import { writable } from 'svelte/store';
	import { newList } from '$lib/stores/lists';
	import DragList from '$lib/components/DragList.svelte';
	import DragRoot from '$lib/components/DragRoot.svelte';

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
	<div class="flex flex-col">
		<DragList let:index list={list1} hoverClass="bg-gray-300" inner={false} targets={['bist2']}>
			{@const entry = list1.get(index)}
			<div class="bg-gray-200 hover:bg-gray-300 transition p-2 rounded-sm">
				<p>{entry.name}</p>
			</div>
		</DragList>
	</div>

	<div class="flex flex-col">
		<DragList let:index list={list2} hoverClass="bg-gray-300">
			{@const entry = list2.get(index)}
			<div class="bg-gray-200 hover:bg-gray-300 transition p-2 rounded-sm">
				<p>{entry.name}</p>
			</div>
		</DragList>
	</div>
</main>

<DragRoot onCollision={(drag, hit) => console.log(drag, hit)} />
