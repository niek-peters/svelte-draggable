<script lang="ts">
	import { dragListClassName } from '$lib';
	import { dragging } from '$lib/stores/dragging';
	import type { List } from '$lib/stores/lists';
	import Draggable from './Draggable.svelte';

	export let list: List<any>;
	const { uid, store } = list;

	export let listClass: string = '';
	export let listStyle: string = '';

	export let inner = true;
	export let targets: string[] = [];
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
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
		<Draggable group_uid={uid} {inner} {targets} uid={entry.uid}>
			<slot index={$store.indexOf(entry)} />
		</Draggable>
	{/each}
</div>
