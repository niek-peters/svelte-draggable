<script lang="ts">
	import { draggableClassName } from '$lib';
	import { drag, end, start } from '$lib/utils';
	import { dragging } from '$lib/stores/dragging';

	export let uid = crypto.randomUUID();
	export let group_uid: string = 'default';

	export let inner = true;
	export let targets: string[] = [];

	export let remove: (target: HTMLElement) => void = () => {};

	function bind(el: HTMLElement) {
		// bind remove function
		el.querySelector('button[name="delete"]')?.addEventListener('click', () => {
			remove(el);
		});

		// bind drag function
		const dragHandle = el.querySelector('button[name="drag"]');
		if (dragHandle !== null)
			dragHandle.addEventListener('touchstart', (e) => {
				start(e as TouchEvent, el);
			});
		else {
			el.style.cssText += 'touch-action: none;';

			el.addEventListener('touchstart', (e) => {
				start(e as TouchEvent, el);
			});
		}

		// bind contextmenu function
		const deleteHandle = el.querySelector('button[name="delete"]');
		if (deleteHandle === null)
			el.addEventListener('contextmenu', (e) => {
				const target = e.currentTarget as HTMLElement;
				if (target === null) return;

				remove(target);
			});
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	use:bind
	class={draggableClassName}
	id={uid}
	data-group_uid={group_uid}
	data-inner={inner}
	data-targets={targets}
	on:dragstart={start}
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
	on:contextmenu|preventDefault={(e) => {
		const target = e.currentTarget;
		if (target === null) return;

		remove(target);
	}}
	draggable="true"
	style="opacity: {$dragging && $dragging.element.id === uid ? 0 : 100};"
>
	<slot />
</div>
