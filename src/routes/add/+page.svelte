<script lang="ts">

	import { notifications } from '$lib/stores/notifications';
	import Toast from '$lib/stores/Toast.svelte';
	import { onMount } from 'svelte';
	import type { Customer } from '$lib/customer';
	import { writeStore } from '$lib/stores';

	onMount(() => {});
	
	let id = '';
	let lastName = '';
	let firstName = '';
	let phone = '';
	let email  = '';
	let balance = 0;
	let notes = '';
	let customer = {};
	$: searchTerms = `${firstName} ${lastName} ${email}`

	async function addNewCustomer() {
		const uniqueId = crypto.randomUUID();
		let customer: Customer = {
			id: uniqueId,
			lastName: lastName,
			firstName: firstName,
			phone: phone,
			email: email,
			balance: balance,
			notes: notes,
			searchTerms: searchTerms
		}
		writeStore('customers', customer).then((returnedSomething) => {
			 JSON.stringify(returnedSomething + ': returned from write store')
		})
		.catch((err) => {
			console.error(err);
		})
		.finally(() => {
			clearCustomer();
			notifications.success('Customer Successfully Saved', 3000);
		});
	}

	function clearCustomer() {
		id = '';
		lastName = '';
		firstName = '';
		phone = '';
		email  = '';
		balance = 0;
		notes = '';
	}

</script>

<svelte:head>
	<title>ADD</title>
	<meta name="description" content="Add New Customer" />
</svelte:head>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-5 mt-10">
		<h1 class="h1">ADD CUSTOMER</h1>
		<form id="orderForm">
			<label class="label mt-5">
				<span>Last Name</span>
				<input bind:value={lastName} class="input" type="text" placeholder="" required/>
			</label>
			<label class="label mt-5">
				<span>First Name</span>
				<input bind:value={firstName} class="input" type="text" placeholder="" required/>
			</label>
			<label class="label mt-5">
				<span>Phone #</span>
				<input bind:value={phone} class="input" type="text" placeholder="" />
			</label>
			<label class="label mt-5">
				<span>Email</span>
				<input bind:value={email} class="input" type="text" placeholder="" />
			</label>
			<label class="label mt-5">
				<span>Balance</span>
				<input bind:value={balance} class="input" type="number" placeholder="" />
			</label>
			<label class="label mt-5">
				<span>Notes: </span>
				<textarea bind:value={notes} class="textarea" rows="4" placeholder="Notes for the customer" />
			</label>
		</form>
		<button disabled={!lastName} on:click={addNewCustomer} id="addCustomer" type="button" class="btn variant-filled">
			<span>Add</span>
		</button>		
	</div>
</div>
<Toast />
