# Svelte Draggable

A simple, typesafe library that makes it trivial to create lists of draggable elements.

```svelte
<script lang="ts">
	import { writable } from 'svelte/store';
	import { DragList, DragRoot, newList } from '$lib';

	const gamesRanking = newList(
		'games',
		writable([
			{ uid: crypto.randomUUID(), name: 'Minecraft' },
			{ uid: crypto.randomUUID(), name: 'Subnautica' },
			{ uid: crypto.randomUUID(), name: 'Satisfactory' }
		])
	);
</script>

<DragList let:index list={gamesRanking}>
	{@const game = gamesRanking.get(index)}
	<p>{game.name}</p>
</DragList>

<DragRoot />
```

## Features

Drag elements between lists by setting targets

```svelte
<!-- Now elements can be dragged from list 1 -> list 2, but not back -->
<DragList ... list={list1} targets={['list2']}>...</DragList>

<DragList ... list={list2}>...</DragList>
```

Disable inner list reordering

```svelte
<DragList ... inner={false}>...</DragList>
```

Add mobile friendly buttons for dragging/removing

```svelte
<DragList ...>
	<button name="drag">Drag here!</button>
	<button name="delete">Delete</button>
</DragList>
```

## Install

SvelteKit:
`npm i -D @niek-peters/svelte-draggable`

Svelte:
`npm i @niek-peters/svelte-draggable`

## Notes

- This package is still **highly experimental** and will probably change a ton in the near future. Use at your own risk!
