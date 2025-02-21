<script lang="ts">
	import '../app.postcss';
	import { Modal, initializeStores } from '@skeletonlabs/skeleton';
	import Header from './Header.svelte';
	import { fade } from 'svelte/transition';
	import { user } from '$lib/firebase';
	import { goto } from '$app/navigation';

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	initializeStores();
	onMount(() => {
		const unsubscribe = user.subscribe((userData) => {
			if (!userData) {
				goto('/login');
			} else {
				goto('/');
			}
		});
		return unsubscribe;
	});
</script>

<Modal />
<div class="app">
	<Header {user} />
	<main in:fade={{ duration: 300 }}>
		<slot {user} />
	</main>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>
