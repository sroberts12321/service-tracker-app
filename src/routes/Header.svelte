<script lang="ts">
	import { page } from '$app/stores';
	import { logoutUser } from '$lib/firebase';
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';

	const protectedRoutes = [
		{ path: '/', label: 'Search' },
		{ path: '/add/', label: 'Add' }
	];
	function handleLogout() {
		const confirmLogoutModal: ModalSettings = {
			type: 'confirm',
			title: 'Please Confirm',
			body: 'Are you sure you want to logout?',
			response: (r: boolean) => {
				if (r) {
					logoutUser();
					modalStore.close();
				}
			}
		};
		modalStore.trigger(confirmLogoutModal);
	}
	export let user;
	const modalStore = getModalStore();
</script>

<header>
	<div class="corner" />
	<nav>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
		</svg>
		<ul class="nav-list">
			{#if $user?.isAuthenticated}
				{#each protectedRoutes as route}
					<li
						class="text-surface-500"
						aria-current={$page.url.pathname === route.path ? 'page' : undefined}
					>
						<a href={route.path}>{route.label}</a>
					</li>
				{/each}
			{:else}
				<li
					class="text-surface-500"
					aria-current={$page.url.pathname === '/login/' ? 'page' : undefined}
				>
					<a href="/login">Login</a>
				</li>
			{/if}
		</ul>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
		</svg>
	</nav>

	<div class="corner">
		{#if $user?.isAuthenticated}
			<button
				type="button"
				class="btn variant-glass-surface mt-2 -ml-12"
				on:click={() => handleLogout()}
			>
				<span> Logout </span>
			</button>
		{/if}
	</div>
</header>

<style>
	nav {
		display: flex;
		justify-content: center;
		--background: rgba(255, 255, 255, 0.7);
	}

	header {
		display: flex;
		justify-content: space-between;
	}

	.corner {
		width: 3em;
		height: 3em;
	}

	svg {
		width: 2em;
		height: 3em;
		display: block;
	}

	path {
		fill: var(--background);
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: var(--background);
		background-size: contain;
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 0.5rem;
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: var(--color-theme-2) 2s linear;
	}

	a:hover {
		color: var(--color-theme-1);
	}

	.nav-list {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: var(--background);
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
		transition: transform 0.2s ease, color 0.2s ease;
	}

	li:hover {
		transform: translateY(-2px);
	}

	li[aria-current='page']::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--color-primary-500);
		opacity: 0;
		animation: dropIn 0.3s ease forwards;
	}

	@keyframes dropIn {
		from {
			opacity: 0;
			transform: translateY(-8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 0.5rem;
		color: var(--color-text);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: all 0.2s ease;
		position: relative;
	}

	a::after {
		content: '';
		position: absolute;
		bottom: 0.5em;
		left: 0.5rem;
		right: 0.5rem;
		height: 2px;
		background: var(--color-primary-500);
		transform: scaleX(0);
		transition: transform 0.2s ease;
	}

	li:hover a::after {
		transform: scaleX(1);
	}

	li[aria-current='page'] a::after {
		transform: scaleX(1);
		background: var(--color-primary-300);
	}

	li[aria-current='page']::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - 6px);
		border: 6px solid transparent;
		border-top: 6px solid rgba(var(--color-surface-500) / 1);
	}
</style>
