<script lang="ts">
	import { notifications } from '$lib/stores/notifications';
	import Toast from '$lib/Toast.svelte';
	import { fade } from 'svelte/transition';
	import type { Customer } from '$lib/customer';
	import { writeStore } from '$lib/firebase';

	let id = '';
	let documentId = '';
	let lastName = '';
	let firstName = '';
	let phone = '';
	let email = '';
	let balance = 0;
	let notes = '';
	let nickname = '';
	let label = '';
	$: searchTerms = `${firstName} ${lastName} ${email} ${nickname} ${phone} *`;

	async function addNewCustomer() {
		if (firstName.length > 0) {
			label = `${lastName}, ${firstName}`;
		} else {
			label = lastName;
		}
		const uniqueId = crypto.randomUUID();
		let customer: Customer = {
			id: uniqueId,
			documentId: documentId,
			lastName: lastName,
			firstName: firstName,
			nickname: nickname,
			phone: phone,
			email: email,
			balance: balance,
			notes: notes,
			searchTerms: searchTerms,
			label: label
		};
		writeStore('customers', customer)
			.catch((err) => {
				console.error(JSON.stringify(err) + ' : this is the error');
				notifications.danger('Error adding to database', 3000);
			})
			.finally(() => {
				clearCustomer();
			});
	}

	function clearCustomer() {
		id = '';
		lastName = '';
		firstName = '';
		nickname = '';
		phone = '';
		email = '';
		balance = 0;
		notes = '';
		label = '';
	}
</script>

<svelte:head>
	<title>ADD</title>
	<meta name="description" content="Add New Customer" />
</svelte:head>

<div in:fade={{ duration: 300 }} class="container h-full mx-auto flex justify-center items-center">
	<div>
		<h3 class="h2 text-primary-500">Add Customer</h3>
		<form id="orderForm">
			<div class="grid grid-cols-2">
				<label class="label mt-1 mr-5">
					<span>Last Name</span>
					<input
						bind:value={lastName}
						class="input"
						type="text"
						placeholder=""
						autocomplete="off"
						required
					/>
				</label>
				<label class="label mt-1">
					<span>First Name</span>
					<input
						bind:value={firstName}
						class="input"
						type="text"
						placeholder=""
						autocomplete="off"
					/>
				</label>
				<label class="label mt-1 mr-5">
					<span>Phone #</span>
					<input bind:value={phone} class="input" type="text" placeholder="" autocomplete="off" />
				</label>
				<label class="label mt-1">
					<span>Email</span>
					<input bind:value={email} class="input" type="text" placeholder="" autocomplete="off" />
				</label>
				<label class="label mt-1 mr-5">
					<span>Nickname</span>
					<input
						bind:value={nickname}
						class="input"
						type="text"
						placeholder=""
						autocomplete="off"
					/>
				</label>
				<label class="label mt-1">
					<span>Notes: </span>
					<textarea
						bind:value={notes}
						class="textarea"
						rows="2"
						placeholder="Notes for the customer"
						autocomplete="off"
					/>
				</label>
			</div>
		</form>
		<button
			disabled={!lastName}
			on:click={addNewCustomer}
			id="addCustomer"
			type="button"
			class="btn variant-filled"
		>
			<span>Add</span>
		</button>
	</div>
</div>
<Toast />
