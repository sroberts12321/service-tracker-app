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

	// We need to keep track of initial state to determine if a modal asking to save changes should appear
	let initialState: Customer;

	// Label
	$: customerDetail.label =
		customerDetail.firstName.length > 0
			? `${customerDetail.lastName}, ${customerDetail.firstName}`
			: customerDetail.lastName;

	// Search terms
	$: customerDetail.searchTerms = `${customerDetail.firstName} ${customerDetail.lastName} ${customerDetail.email} ${customerDetail.nickname} ${customerDetail.phone} *`;

	customerInfo.subscribe((data) => {
		customerDetail = data;
	});

	onMount(() => {
		initialState = {
			id: customerDetail.id,
			documentId: customerDetail.documentId,
			lastName: customerDetail.lastName,
			firstName: customerDetail.firstName,
			nickname: customerDetail.nickname,
			phone: customerDetail.phone,
			email: customerDetail.email,
			balance: customerDetail.balance,
			notes: customerDetail.notes,
			searchTerms: customerDetail.searchTerms,
			label: customerDetail.label
		};
	});

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';

	async function handleEditCustomer() {
		writeCustomerUpdate(customerDetail)
			.then((returnedInfo) => {
				JSON.stringify(returnedInfo);
				customerInfo.set(customerDetail);
			})
			.catch((err) => {
				console.error(err);
			});
	}

	function handleSubmitCustomerChange() {
		handleEditCustomer();
		const c: ModalComponent = { ref: CustomerDetail };
		const settings: ModalSettings = {
			type: 'component',
			component: c,
			title: customerDetail.label,
			body: `Account Notes: \n${customerDetail.notes}`,
			meta: customerData,
			buttonTextCancel: 'Close',
			response: (r) => console.log('response:', r)
		};
		modalComponentForm(settings, c);
	}

	const confirmDeleteModal: ModalSettings = {
		type: 'confirm',
		title: 'Please Confirm',
		body: 'Are you sure you want to delete this customer?',
		response: (r: boolean) => {
			if (r) {
				deleteCustomer(customerDetail);
			}
		}
	};

	const confirmSaveModal: ModalSettings = {
		type: 'confirm',
		title: 'Please Confirm',
		body: 'Do you want to save changes?',
		response: (r: boolean) => {
			if (r) {
				const c: ModalComponent = { ref: CustomerDetail };
				const settings: ModalSettings = {
					type: 'component',
					component: c,
					title: customerDetail.label,
					body: `Account Notes: \n${customerDetail.notes}`,
					meta: customerData,
					buttonTextCancel: 'Close',
					response: (r) => console.log('response:', r)
				};
				modalComponentForm(settings, c);
				handleEditCustomer();
			} else {
				resetInitialCustomerState();
				customerInfo.set(initialState);
				handleReturnToCustomerDetail();
			}
		}
	};

	function confirmDelete() {
		modalStore.close();
		modalStore.trigger(confirmDeleteModal);
	}

	function modalComponentForm(settings: ModalSettings, modal: ModalComponent): void {
		modalStore.close();
		modalStore.trigger(settings);
	}

	function resetInitialCustomerState() {
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
			modalStore.close();
			modalStore.trigger(confirmSaveModal);
		} else {
			handleReturnToCustomerDetail();
		}
	}

	function handleReturnToCustomerDetail() {
		let customerFullName = '';
		if (customerDetail.firstName.length > 0) {
			customerFullName = `${customerDetail.lastName}, ${customerDetail.firstName}`;
		} else {
			customerFullName = customerDetail.lastName;
		}
		const c: ModalComponent = { ref: CustomerDetail };
		const settings: ModalSettings = {
			type: 'component',
			component: c,
			title: customerFullName,
			body: `Account Notes: \n${customerDetail.notes}`,
			meta: customerData,
			buttonTextCancel: 'Close',
			response: (r) => console.log('response:', r)
		};
		modalComponentForm(settings, c);
	}
</script>

<!-- @component creates a modal with a way of editing a given service. -->

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{customerDetail.label}</header>
		<article>{`Account Notes: ${customerDetail.notes}`}</article>
		<form id="orderForm">
			<div class="grid grid-cols-2">
				<label class="label mt-1 mr-5">
					<span>Last Name</span>
					<input
						bind:value={customerDetail.lastName}
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
						bind:value={customerDetail.firstName}
						class="input"
						type="text"
						placeholder=""
						autocomplete="off"
						required
					/>
				</label>
				<label class="label mt-1 mr-5">
					<span>Phone #</span>
					<input
						bind:value={customerDetail.phone}
						class="input"
						type="text"
						placeholder=""
						autocomplete="off"
					/>
				</label>
				<label class="label mt-1 row-span-2">
					<span>Notes: </span>
					<textarea
						bind:value={customerDetail.notes}
						class="textarea"
						rows="4"
						placeholder="Notes for the customer"
						autocomplete="off"
					/>
				</label>
				<label class="label mt-1 mr-5">
					<span>Nickname</span>
					<input
						bind:value={customerDetail.nickname}
						class="input"
						type="text"
						placeholder=""
						autocomplete="off"
					/>
				</label>
			</div>
		</form>
		<!-- prettier-ignore -->
		<footer class="modal-footer {parent.regionFooter} flex justify-between">
		<button class="btn variant-filled-error" type="button" on:click={confirmDelete}>Delete</button>
		<div>
			<button class="btn {parent.buttonNeutral}" on:click={handleChangeCustomerDataConfirm}>{parent.buttonTextCancel}</button>
			<button class="btn {parent.buttonPositive}" on:click={handleSubmitCustomerChange}>Submit Change</button>
		</div>
    </footer>
	</div>
{/if}
