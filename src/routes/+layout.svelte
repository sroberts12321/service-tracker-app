<script lang="ts">
	import '../app.postcss';
	import {
		Drawer,
		Modal,
		initializeStores,
		getModalStore,
		getDrawerStore,
		type ModalSettings
	} from '@skeletonlabs/skeleton';
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
	const modalStore = getModalStore();
	const drawerStore = getDrawerStore();
	function handleLogout() {
		const confirmLogoutModal: ModalSettings = {
			type: 'confirm',
			title: 'Please Confirm',
			body: 'Are you sure you want to logout?',
			response: (r: boolean) => {
				if (r) {
					modalStore.close();
					drawerStore.close();
				}
			}
		};
		modalStore.trigger(confirmLogoutModal);
	}

	function handleRefresh() {
		drawerStore.close();
	}
</script>

<Modal />
<Drawer>
	<nav class="list-nav">
		<ul>
			<li><a href="#" on:click={() => handleRefresh()}>Refresh</a></li>
			<li><a href="#" on:click={() => handleLogout()}>Logout</a></li>
		</ul>
	</nav>
</Drawer>
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
