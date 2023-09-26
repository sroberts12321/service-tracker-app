<script lang="ts">
	import { readStore, writeStore } from '$lib/stores';
	import type { Customer } from '$lib/customer';
	import SvelteTable from 'svelte-table';
	import { onMount } from 'svelte';
	// /**
	//  * @type {any[]}
	//  */
	// let customerStore = [];

	// onMount(async () => {
	// 	console.log('inside the onMount function');
	// 	readStore('customers')
	// 	.then((returnedCustomers) => {
	// 		 returnedCustomers.forEach((/** @type {{ id: any; data: () => any; get: (arg0: string) => any; }} */ doc) => {
	// 			customer = {
	// 				id: doc.id,
	// 				lastName: doc.get('lastName'),
	// 				firstName: doc.get('firstName'),
	// 				phone: doc.get('phone'),
	// 				email: doc.get('email')
	// 			}
	// 			customerStore = [...customerStore, customer];
	// 		});
	// 	})
	// 	.catch((err) => {
	// 		console.error(err);
	// 	})
	// 	.finally(() => {
	// 		console.log('Experiment completed');
	// 	});	
	// });

	let id = '';
	let lastName = '';
	let firstName = '';
	let phone = '';
	let email  = '';
	let balance = 0;
	let notes = '';
	// let customer = {};

	const addCustomer = () => {
		const uniqueId = crypto.randomUUID();
		let customer: Customer = {
			id: uniqueId,
			lastName: lastName,
			firstName: firstName,
			phone: phone,
			email: email,
			balance: balance,
			notes: notes
		}
		writeStore('customers', customer);
		clearCustomer();
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

	const columns = [	
	{
		key: "firstName",
		title: "FIRST NAME",
		value: v => v.firstName,
		sortable: true,
		filterOptions: rows => {
		// use first letter of first_name to generate filter
		let letrs = {};
		rows.forEach(row => {
			let letr = row.firstName.charAt(0);
			if (letrs[letr] === undefined)
			letrs[letr] = {
				name: `${letr.toUpperCase()}`,
				value: letr.toLowerCase(),
			};
		});
		// fix order
		letrs = Object.entries(letrs)
			.sort()
			.reduce((o, [k, v]) => ((o[k] = v), o), {});
		return Object.values(letrs);
		},
		filterValue: v => v.firstName.charAt(0).toLowerCase(),
	},
	{
		key: "lastName",
		title: "LAST NAME",
		value: v => v.lastName,
		sortable: true,
		filterOptions: rows => {
		// use first letter of last_name to generate filter
		let letrs = {};
		rows.forEach(row => {
			let letr = row.lastName.charAt(0);
			if (letrs[letr] === undefined)
			letrs[letr] = {
				name: `${letr.toUpperCase()}`,
				value: letr.toLowerCase(),
			};
		});
		// fix order
		letrs = Object.entries(letrs)
			.sort()
			.reduce((o, [k, v]) => ((o[k] = v), o), {});
		return Object.values(letrs);
		},
		filterValue: v => v.lastName.charAt(0).toLowerCase(),
	},
	{
		key: "email",
		title: "EMAIL",
		value: v => v.email,
		renderValue: v => v.email.charAt(0).toUpperCase() + v.email.substring(1), // capitalize
		sortable: true,
		filterOptions: ["", "cat", "dog"], // provide array
	},
	];

</script>

<svelte:head>
	<title>Search</title>
	<meta name="description" content="Find Customer" />
</svelte:head>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-5 mt-10">
		<h1 class="h1">Find Customer</h1>
		<form id="searchForm">
			<label class="label mt-5">
				<span>Last Name</span>
				<input bind:value={lastName} class="input" type="text" placeholder="" />
			</label>
		<button on:click={addCustomer} id="searchBtn" type="button" class="btn variant-filled mt-5">
			<span>Find</span>
		</button>	
	</div>
</div>
<div class="table-container">
	<!-- Native Table Element -->
	<table class="table table-hover">
		<thead>
			<tr>
				<th>Last Name</th>
				<th>First Name</th>
				<th>Email</th>
			</tr>
		</thead>
		<tbody>
			{#each customerStore as row, i}
				<tr>
					<td>{row.lastName}</td>
					<td>{row.firstName}</td>
					<td>{row.email}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>


<div class="flex flex-col space-y-4 space-x-2 place-content-center w-full">
	<SvelteTable columns={columns} rows={customerStore}>	
	</SvelteTable>
	<!-- {#each customerStore as customer}
		<div class="">	
			<p>{customer.lastName}</p>
		</div>
	{/each} -->
</div>

