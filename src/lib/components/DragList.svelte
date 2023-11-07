<script lang="ts">
	import { dragListClassName } from '$lib';
	import Draggable from '$lib/components/Draggable.svelte';
	import { dragging } from '$lib/stores/dragging';
	import { lists } from '$lib/stores/lists';

	import type { List } from '$lib/types';

	export let list: List<any>;
	const { uid, store } = list;

	export let listClass: string = '';
	export let listStyle: string = '';

	export let inner = true;
	export let targets: string[] = [];

	export let _this: HTMLDivElement | undefined = undefined;

	function remove(target: HTMLElement) {
		const id = target.id;
		const group_uid = target.dataset['group_uid'];
		if (group_uid === undefined) return;

		const [store, index] = lists.getIndex(group_uid, id);
		if (store === undefined || index === undefined) return;

		store.store.update((store) => {
			store.splice(index, 1);
			return store;
		});
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	bind:this={_this}
	id={uid}
	class="{dragListClassName} {listClass}"
	style={listStyle}
	data-group_uid={uid}
	data-inner={inner}
	data-targets={targets}
	on:dragover={(e) => {
		if (!$dragging) return;

		const id = e.currentTarget.id;
		const dragging_id = $dragging.element.id;

		if ($dragging.targets.find((target) => target.id === id || dragging_id === id))
			e.preventDefault();
	}}
>
	{#each $store as entry (entry.uid)}
		<Draggable group_uid={uid} {inner} {targets} uid={entry.uid} {remove}>
			<slot index={$store.indexOf(entry)} />
		</Draggable>
	{/each}
</div>
