<script lang="ts">
	import type { List } from '$lib/stores/lists';
	import Draggable from './Draggable.svelte';

	export let list: List<any>;
	const { uid, store } = list;

	export let hoverStyle: string | undefined = undefined;
	export let hoverClass: string | undefined = undefined;

	export let inner = true;
	export let targets: string[] = [];
</script>

{#each $store as entry}
	<Draggable group_uid={uid} {hoverClass} {hoverStyle} {inner} {targets}>
		<slot index={$store.indexOf(entry)} />
	</Draggable>
{/each}
