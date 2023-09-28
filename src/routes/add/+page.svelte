<script lang="ts">

	import { Table } from '@skeletonlabs/skeleton';
	import { tableMapperValues } from '@skeletonlabs/skeleton';
	import SvelteTable from 'svelte-table';
	import { onMount } from 'svelte';
	import type { Customer } from '$lib/customer';

	let customers: any = [];

	/**
	 * @type {any[]}
	 */
	 let data = [
		{
			id: 1,
			lastName: 'Adams',
			firstName: 'John',
			phone: '555-555-555',
			email: 'fake@gmail.com',
			balance: 100.00,
			notes: 'we\'re not anything'
		},
		{
			id: 2,
			lastName: 'Lincoln',
			firstName: 'Abe',
			phone: '555-555-6666',
			email: 'madeup@gmail.com',
			balance: 0,
			notes: 'N/A'
		},
		{
			id: 3,
			lastName: 'Washington',
			firstName: 'George',
			phone: '555-555-7777',
			email: 'nothing@gmail.com',
			balance: 0,
			notes: 'N/A'
		}
	];	

	onMount(() => {});
	
	let id;
	let lastName = '';
	let firstName = '';
	let phone = '';
	let email  = '';
	let balance = '';
	let notes = '';
	let customer = {};

	async function addNewCustomer() {
		const uniqueId = () => {
			const dateString = Date.now().toString(36);
			const randomness = Math.random().toString(36).substr(2);
			return dateString + randomness;
		};
		customer = {
			id: uniqueId,
			lastName: lastName,
			firstName: firstName,
			phone: phone,
			email: email,
			balance: balance,
			notes: notes
		}
		customers = [...customers, customer];
		clearCustomer();
	}

	function clearCustomer() {
		id = '';
		lastName = '';
		firstName = '';
		phone = '';
		email  = '';
		balance = '';
		notes = '';
	}

	
const tableSimple = {
	// A list of heading labels.
	head: ['Last Name', 'First Name', 'Phone', 'Email', 'Balance'],
	// The data visibly shown in your table body UI.
	body: tableMapperValues(customers, ['lastName', 'firstName', 'phone', 'email', 'balance']),
	meta: tableMapperValues(customers, ['notes']),
};

let columns = [
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
  }
];

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
	<div>
		<Table class="m-10" source={tableSimple}/>
		<div class="m-10">
			<SvelteTable columns={columns} rows={data}>
	
			</SvelteTable>
		</div>
	</div>
</div>


