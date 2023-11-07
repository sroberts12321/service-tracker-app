<script lang="ts">
	// Props
	/** Exposes parent props to this component. */
	export let parent: any;

	// Stores
	import { getModalStore, type ModalSettings, type ModalComponent } from '@skeletonlabs/skeleton';
	import { writeCustomerUpdate, deleteCustomer } from './firebase';
	import CustomerDetail from './CustomerDetail.svelte';
	import type { Customer } from './customer';
	import { customerInfo } from './stores/customer-store';
	import { onMount } from 'svelte';
	const modalStore = getModalStore();

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
			searchTerms: customerDetail.searchTerms
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
			customerDetail.nickname)
		.then((returnedInfo) => {
			JSON.stringify(returnedInfo);
			customerInfo.set(customerDetail);
		}).catch((err) => {
			console.error(err);
		}).finally(() => {handleReturnToCustomerDetail()});
	}

	const confirmModal: ModalSettings = {
		type: 'confirm',
		title: 'Please Confirm',
		body: 'Are you sure you want to delete this customer?',
		response: (r: boolean) => {
			if (r) {
				deleteCustomer(customerDetail.id);
			}
		},
	};

	function confirmDelete() {
		modalStore.close();
		modalStore.trigger(confirmModal);
	}	

	function modalComponentForm(settings: ModalSettings, modal: ModalComponent): void {
		modalStore.trigger(settings);
		modalStore.close();
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
						customerInfo.set(initialState);
						handleReturnToCustomerDetail();
					}	
				},
			}
			modalStore.close();
			modalStore.trigger(confirmSaveModal);
		} else {
			handleReturnToCustomerDetail();
		}
	}	

	function handleReturnToCustomerDetail() {
		const c: ModalComponent = { ref: CustomerDetail };
		const settings: ModalSettings = {
			type: 'component',
			component: c,
			title: `${customerDetail.firstName} ${customerDetail.lastName}`,
			body: `Account Notes: \n${customerDetail.notes}`,
			meta: customerDetail,
			buttonTextCancel: 'Close',
			response: (r) => console.log('response:', r)
		};
		modalStore.close();
		modalStore.trigger(settings);
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
					<input disabled={true} bind:value={customerDetail.lastName} class="input" type="text" placeholder="" required/>
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
		<button class="btn variant-filled-error" type="button" on:click={confirmDelete}>Delete</button>
        <button class="btn {parent.buttonNeutral}" on:click={handleChangeCustomerDataConfirm}>{parent.buttonTextCancel}</button>
                <button class="btn {parent.buttonPositive}" on:click={handleEditCustomer}>Submit Change</button>
    </footer>
	</div>
{/if}

