<script lang="ts">
	// Props
	/** Exposes parent props to this component. */
	export let parent: any;

	// Stores
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { writeCustomerUpdate } from './firebase';
	const modalStore = getModalStore();
	const customerData = $modalStore[0].meta;

    const customerDetail = {
		customerId: customerData.customerId,
        lastName: customerData.lastName,
        firstName: customerData.firstName,
        phone: customerData.phone,
		email: customerData.email,
		balance: customerData.balance,
		notes: customerData.notes,
		nickname: customerData.nickname
    }

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
    const tableHeader = 'sticky top-0';
    const cForm = 'border border-surface-500 p-4 space-y-4 rounded-container-token'; 

	async function handleEditCustomer() {
		writeCustomerUpdate(customerDetail.customerId, customerDetail.lastName, customerDetail.firstName, customerDetail.phone, customerDetail.email, customerDetail.balance, customerDetail.notes, customerDetail.nickname).then((returnedInfo) => {
			JSON.stringify(returnedInfo);
		}).catch((err) => {
			console.error(err);
		}).finally(() => {modalStore.close()});
	}
</script>

<!-- @component creates a modal with a way of editing a given service. -->

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</header>
		<article>{$modalStore[0].body ?? '(body missing)'}</article>
		<form id="orderForm">
			<div class="grid grid-cols-2">
				<label class="label mt-5 mr-5">
					<span>Last Name</span>
					<input bind:value={customerDetail.lastName} class="input" type="text" placeholder="" required/>
				</label>
				<label class="label mt-5">
					<span>First Name</span>
					<input bind:value={customerDetail.firstName} class="input" type="text" placeholder="" required/>
				</label>
				<label class="label mt-5 mr-5">
					<span>Phone #</span>
					<input bind:value={customerDetail.phone} class="input" type="text" placeholder="" />
				</label>
				<label class="label mt-5">
					<span>Email</span>
					<input bind:value={customerDetail.email} class="input" type="text" placeholder="" />
				</label>
				<label class="label mt-5 mr-5">
					<span>Nickname</span>
					<input bind:value={customerDetail.nickname} class="input" type="text" placeholder="" />
				</label>
				<label class="label mt-5">
					<span>Notes: </span>
					<textarea bind:value={customerDetail.notes} class="textarea" rows="4" placeholder="Notes for the customer" />
				</label>
			</div>
		</form>
		<!-- prettier-ignore -->
		<footer class="modal-footer {parent.regionFooter}">
        <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
                <button class="btn {parent.buttonPositive}" on:click={handleEditCustomer}>Submit Change</button>
    </footer>
	</div>
{/if}

