<script lang="ts">
	import Toast from '$lib/Toast.svelte';
	import { fade } from 'svelte/transition';
	import { loginUser, createUser, handlePasswordReset } from '$lib/firebase';

	let email: string = '';
	let password: string = '';
	let isLogin: boolean = true;
	let showForgotPassword: boolean = false;
	let linkText: string = 'Create new account';
	let forgotPassText: string = 'Forgot Password?';
	function toggleLogin() {
		isLogin = !isLogin;
		linkText = isLogin ? 'Create new account' : 'Login to existing account';
	}
	function toggleForgotPassword() {
		showForgotPassword = !showForgotPassword;
		forgotPassText = showForgotPassword ? 'Return to Login' : 'Forgot Password?';
		if (showForgotPassword) {
			password = '';
		}
	}

	function recoverAccount(email: string) {
		handlePasswordReset(email);
		toggleForgotPassword();
	}
</script>

<svelte:head>
	<title>Login</title>
	<meta name="description" content="Login App User" />
</svelte:head>

<div in:fade={{ duration: 300 }} class="container grid h-full mx-auto justify-center items-center">
	{#if isLogin}
		<div>
			{#if showForgotPassword}
				<h3 in:fade={{ duration: 300 }} class="h2 text-primary-500">Recover Account</h3>
			{:else}
				<h3 in:fade={{ duration: 300 }} class="h2 text-primary-500">Login</h3>
			{/if}
			<form id="orderForm">
				<div class="grid grid-cols-1">
					<label class="label mt-1">
						<span>Email</span>
						<input
							bind:value={email}
							class="input"
							type="text"
							placeholder="email"
							autocomplete="off"
							required
						/>
					</label>
					{#if !showForgotPassword}
						<label class="label mt-1" in:fade={{ duration: 300 }}>
							<span>Password</span>
							<input
								bind:value={password}
								class="input"
								type="password"
								placeholder="password"
								autocomplete="off"
								required
							/>
						</label>
					{:else}
						<div class="h-[72px] w-[279.45px] mt-1" />
					{/if}
				</div>
			</form>
			<div class="grid justify-items-end grid-cols-1 mt-2">
				<a href="#" on:click={toggleForgotPassword}>{forgotPassText}</a>
			</div>
			<div class="grid grid-cols-1">
				{#if showForgotPassword}
					<button
						in:fade={{ duration: 300 }}
						disabled={!email}
						on:click={() => recoverAccount(email)}
						id="recover"
						type="button"
						class="btn variant-filled mt-3"
					>
						<span>Recover</span>
					</button>
				{:else}
					<button
						in:fade={{ duration: 300 }}
						disabled={!email && !password}
						on:click={() => loginUser(email, password)}
						id="login"
						type="button"
						class="btn variant-filled mt-3"
					>
						<span>Login</span>
					</button>
				{/if}
			</div>
			<div class="grid justify-items-end grid-cols-1 mt-5">
				<a href="#" on:click={toggleLogin}>{linkText}</a>
			</div>
		</div>
	{:else}
		<div>
			<h3 in:fade={{ duration: 300 }} class="h2 text-primary-500">Create</h3>
			<form id="orderForm">
				<div class="grid grid-cols-1">
					<label class="label mt-1">
						<span>Email</span>
						<input
							bind:value={email}
							class="input"
							type="text"
							placeholder="email"
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
							placeholder="password"
							autocomplete="off"
							required
						/>
					</label>
				</div>
				<div class="grid justify-items-end grid-cols-1 mt-8" />
			</form>
			<div class="grid grid-cols-1">
				<button
					disabled={!email && !password}
					on:click={() => createUser(email, password)}
					id="createUser"
					type="button"
					class="btn variant-filled-surface mt-3"
				>
					<span>Create</span>
				</button>
			</div>
			<div class="grid justify-items-end grid-cols-1 mt-5">
				<a href="#" on:click={toggleLogin}>{linkText}</a>
			</div>
		</div>
	{/if}
</div>
<Toast />
