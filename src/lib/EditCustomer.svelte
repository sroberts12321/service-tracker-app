<script lang="ts">
	// Props
	/** Exposes parent props to this component. */
	export let parent: any;

	// Stores
	import { getModalStore, type ModalSettings, type ModalComponent } from '@skeletonlabs/skeleton';
	import { writeCustomerUpdate, deleteCustomer } from './firebase';
	import CustomerDetail from './CustomerDetail.svelte';
	import type { Customer } from './customer';
	import { customerInfo, allCustomers } from './stores/customer-store';
	import { onMount } from 'svelte';
	const modalStore = getModalStore();
	let customerData = $modalStore[0].meta;

	let customerDetail: Customer;
	let initialState: Customer;
	customerInfo.subscribe((data) => {
		customerDetail = data;
	})

	onMount(() => {
		initialState = {
			id: customerDetail.id,
			lastName: customerDetail.lastName, 
			firstName: customerDetail.firstName, 
			nickname: customerDetail.nickname,
			phone: customerDetail.phone, 
			email: customerDetail.email, 
			balance: customerDetail.balance, 
			notes: customerDetail.notes,
			searchTerms: customerDetail.searchTerms,
			label: `${customerDetail.lastName}, ${customerDetail.firstName}`
		}
	})	

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';

	async function handleEditCustomer() {
		writeCustomerUpdate(
			customerDetail.id, 
			customerDetail.lastName, 
			customerDetail.firstName, 
			customerDetail.phone, 
			customerDetail.email, 
			customerDetail.balance, 
			customerDetail.notes, 
			customerDetail.nickname,
			customerDetail.searchTerms)
		.then((returnedInfo) => {
			JSON.stringify(returnedInfo);
			customerInfo.set(customerDetail);
		}).catch((err) => {
			console.error(err);
		}).finally(() => {handleReturnToCustomerDetail(true)});
	}

	const confirmModal: ModalSettings = {
		type: 'confirm',
		title: 'Please Confirm',
		body: 'Are you sure you want to delete this customer?',
		response: (r: boolean) => {
			if (r) {
				deleteCustomer(customerDetail.id);
				allCustomers.update(customers => customers.filter((customer) => customer.id  !== customerDetail.id));
			}
		},
	};

	function confirmDelete() {
		modalStore.close();
		modalStore.trigger(confirmModal);
	}	

	function modalComponentForm(settings: ModalSettings, modal: ModalComponent): void {
		modalStore.close();
		modalStore.trigger(settings);
	}

	function resetInitialCustomerState() {
		customerInfo.set(initialState);
		customerData.customerInfo.id = initialState.id;
		customerData.customerInfo.lastName = initialState.lastName; 
		customerData.customerInfo.firstName = initialState.firstName;
		customerData.customerInfo.phone = initialState.phone;
		customerData.customerInfo.email = initialState.email;
		customerData.customerInfo.balance = initialState.balance;
		customerData.customerInfo.notes = initialState.notes;
		customerData.customerInfo.nickname = initialState.nickname;
	}

	async function handleChangeCustomerDataConfirm() {
		if (JSON.stringify(initialState) != JSON.stringify(customerDetail)) {
			const confirmSaveModal: ModalSettings = {
				type: 'confirm',
				title: 'Please Confirm',
				body: 'Do you want to save changes?',
				response: (r: boolean) => {
					if (r) {
						handleEditCustomer();
					} else {
						resetInitialCustomerState();
						handleReturnToCustomerDetail(false);
					}	
				},
			}
			modalStore.close();
			modalStore.trigger(confirmSaveModal);
		} else {
			handleReturnToCustomerDetail(true);
		}
	}	

	function handleReturnToCustomerDetail(closeModal: boolean) {
		const c: ModalComponent = { ref: CustomerDetail };
		const settings: ModalSettings = {
			type: 'component',
			component: c,
			title: `${customerDetail.firstName} ${customerDetail.lastName}`,
			body: `Account Notes: \n${customerDetail.notes}`,
			meta: customerData,
			buttonTextCancel: 'Close',
			response: (r) => console.log('response:', r)
		};
		if (closeModal) {
			modalStore.close();
		}
		modalStore.trigger(settings);
	}

</script>

<!-- @component creates a modal with a way of editing a given service. -->

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</header>
		<article>{`Account Notes: ${customerDetail.notes}` ?? '(body missing)'}</article>
		<form id="orderForm">
			<div class="grid grid-cols-2">
				<label class="label mt-1 mr-5">
					<span>Last Name</span>
					<input disabled={true} bind:value={customerDetail.lastName} class="input" type="text" placeholder="" required/>
				</label>
				<label class="label mt-1">
					<span>First Name</span>
					<input bind:value={customerDetail.firstName} class="input" type="text" placeholder="" required/>
				</label>
				<label class="label mt-1 mr-5">
					<span>Phone #</span>
					<input bind:value={customerDetail.phone} class="input" type="text" placeholder="" />
				</label>
				<label class="label mt-1">
					<span>Email</span>
					<input bind:value={customerDetail.email} class="input" type="text" placeholder="" />
				</label>
				<label class="label mt-1 mr-5">
					<span>Nickname</span>
					<input bind:value={customerDetail.nickname} class="input" type="text" placeholder="" />
				</label>
				<label class="label mt-1">
					<span>Notes: </span>
					<textarea bind:value={customerDetail.notes} class="textarea" rows="2" placeholder="Notes for the customer" />
				</label>
			</div>
		</form>
		<!-- prettier-ignore -->
		<footer class="modal-footer {parent.regionFooter} flex justify-between">
		<button class="btn variant-filled-error" type="button" on:click={confirmDelete}>Delete</button>
		<div>
			<button class="btn {parent.buttonNeutral}" on:click={handleChangeCustomerDataConfirm}>{parent.buttonTextCancel}</button>
			<button class="btn {parent.buttonPositive}" on:click={handleEditCustomer}>Submit Change</button>
		</div>
    </footer>
	</div>
{/if}

