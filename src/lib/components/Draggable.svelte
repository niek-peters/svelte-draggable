<script lang="ts">
	import { draggableClassName } from '$lib';
	import { lastCollision } from '$lib/stores/collision';
	import { dragging } from '$lib/stores/dragging';
	import { hover } from '$lib/stores/hover';
	import { drag, end, start } from '$lib/utils';

	const uid = crypto.randomUUID();
	export let group_uid: string = 'default';

	export let hoverStyle: string | undefined = undefined;
	export let hoverClass: string | undefined = undefined;

	export let inner = true;
	export let targets: string[] = [];

	function setHover() {
		$hover = {
			style: hoverStyle,
			class: hoverClass
		};
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class={draggableClassName}
	id={uid}
	data-group_uid={group_uid}
	data-inner={inner}
	data-targets={targets}
	on:dragstart={(e) => {
		setHover();
		start(e);
	}}
	on:touchstart={(e) => {
		setHover();
		start(e);
	}}
	on:drag={drag}
	on:touchmove={drag}
	on:dragend={end}
	on:touchend={end}
	on:dragover={(e) => {
		if (!$dragging) return;

		const id = e.currentTarget.id;
		const dragging_id = $dragging.element.id;

		if ($dragging.targets.find((target) => target.id === id || dragging_id === id))
			e.preventDefault();
	}}
	draggable="true"
	style="opacity: {$dragging && $dragging.element.id === uid
		? 0
		: 100}; touch-action: none; width: fit-content; height: fit-content"
>
	<slot />
</div>
