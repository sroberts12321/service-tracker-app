<script lang="ts">
	import Toast from '$lib/Toast.svelte';
	import { fade } from 'svelte/transition';
	import { loginUser, createUser, checkAuth } from '$lib/firebase';

	let email = '';
	let password = '';
</script>

<svelte:head>
	<title>Login</title>
	<meta name="description" content="Login App User" />
</svelte:head>

<div in:fade={{ duration: 300 }} class="container h-full mx-auto flex justify-center items-center">
	<div>
		<h3 class="h2 text-primary-500">Login</h3>
		<form id="orderForm">
			<div class="grid grid-cols-1">
				<label class="label mt-1">
					<span>Email</span>
					<input
						bind:value={email}
						class="input"
						type="text"
						placeholder=""
						autocomplete="off"
						required
					/>
				</label>
				<label class="label mt-1">
					<span>Password</span>
					<input
						bind:value={password}
						class="input"
						type="password"
						placeholder=""
						autocomplete="off"
						required
					/>
				</label>
			</div>
		</form>
		<div class="grid grid-cols-2">
			<button
				disabled={!email && !password}
				on:click={() => loginUser(email, password)}
				id="login"
				type="button"
				class="btn variant-filled mt-3"
			>
				<span>Login</span>
			</button>
			<button
				disabled={!email && !password}
				on:click={() => createUser(email, password)}
				id="createUser"
				type="button"
				class="btn variant-filled-surface ml-3 mt-3"
			>
				<span>Create</span>
			</button>
		</div>
	</div>
</div>
<Toast />
