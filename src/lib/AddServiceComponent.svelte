<script lang="ts">
	import {
		getModalStore,
		InputChip,
		type ModalComponent,
		type ModalSettings
	} from '@skeletonlabs/skeleton';
	import CustomerDetail from './CustomerDetail.svelte';
	import { writeStore } from '$lib/firebase';
	import type { Service } from '$lib/service';
	import Toast from '$lib/Toast.svelte';
	import { Timestamp } from 'firebase/firestore';
	import { onMount } from 'svelte';

	let orderNumElement: any;
	onMount(() => {
		if (orderNumElement && orderNumElement.querySelector('input')) {
			orderNumElement.querySelector('input').focus();
		}
	});

	export let parent: any;

	$: dropOffDate = convertDate(new Date().toLocaleDateString(), 'initial');
	let expirationDate = new Date();
	let paid = false;
	let pickUpDate = '';
	let pickedUp = false;
	let isReady = false;
	let notes = '';
	let referenceNum: string;
	let lastEnteredRefNum: string;
	let listOfRefNums: string[] = [];
	let typeOfService = 'Cleaning';
	let numValidationRegEx = new RegExp('^[0-9]+$');
	$: if (listOfRefNums.length > 0 && lastEnteredRefNum != null) {
		increment();
	}

	function convertDate(dateStr: string, dateType: string) {
		let newDateList;
		let month;
		let day;
		let year;
		let newDate;

		if (dateType === 'initial') {
			newDateList = dateStr.split('/');
			month = newDateList[0];
			day = newDateList[1];
			year = newDateList[2];
		} else {
			newDateList = dateStr.split('-');
			month = newDateList[1];
			day = newDateList[2];
			year = newDateList[0];
		}

		if (month.length < 2) {
			month = `0${month}`;
		}

		if (day.length < 2) {
			day = `0${day}`;
		}

		if (dateType === 'initial') {
			newDate = `${year}-${month}-${day}`;
		} else {
			newDate = `${month}/${day}/${year}`;
		}

		return newDate;
	}

	const modalStore = getModalStore();
	const customerData = $modalStore[0].meta;

	function handleReturnToCustomerDetail() {
		const c: ModalComponent = { ref: CustomerDetail };
		const settings: ModalSettings = {
			type: 'component',
			component: c,
			title: `${customerData.customerInfo.firstName} ${customerData.customerInfo.lastName}`,
			body: `Account Notes: \n${customerData.customerInfo.notes}`,
			meta: customerData,
			buttonTextCancel: 'Close',
			response: (r) => console.log('response:', r)
		};
		modalStore.close();
		modalStore.trigger(settings);
	}

	async function handleAddNewService() {
		if (listOfRefNums.length > 0) {
			referenceNum = listOfRefNums.join(', ');
		}
		// This is here because of legacy service data structures
		if (!customerData.customerInfo.documentId === undefined) {
			customerData.customerInfo.id = customerData.customerInfo.documentId;
		}
		expirationDate.setFullYear(expirationDate.getFullYear() + 2);
		let service: Service = {
			customerId: customerData.customerInfo.id,
			serviceId: '',
			dropOffDate: convertDate(dropOffDate, 'database'),
			paid: paid,
			pickedUp: pickedUp,
			pickUpDate: pickUpDate,
			isReady: isReady,
			referenceNum: referenceNum,
			typeOfService: typeOfService,
			notes: notes,
			expirationDate: Timestamp.fromDate(expirationDate)
		};

		writeStore('services', service)
			.then((returnedSomething) => {
				handleReturnToCustomerDetail();
			})
			.catch((err) => {
				console.error(err);
			})
			.finally(() => {
				clearForm();
			});
	}

	function increment() {
		if (Number(lastEnteredRefNum) > 9999) {
			referenceNum = '0';
		} else {
			referenceNum = (Number(lastEnteredRefNum) + 1).toString();
		}
	}

	function clearForm() {
		dropOffDate = new Date().toJSON().slice(0, 10);
		paid = false;
		typeOfService = 'Cleaning';
		notes = '';
		listOfRefNums = [];
	}

	function inputChipValidation(event: Event) {
		if (event instanceof InputEvent && event.data != null) {
			if (
				!numValidationRegEx.test(event.data) ||
				Number(referenceNum) > 10000 ||
				referenceNum.length > 5
			) {
				referenceNum = referenceNum.slice(0, referenceNum.length - 1);
			}
		}
	}

	function onChipAdd() {
		lastEnteredRefNum = referenceNum;
	}

	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
</script>

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</header>
		<article>{$modalStore[0].body ?? '(body missing)'}</article>
		<form id="orderForm">
			<div class="grid grid-cols-4 -mt-4">
				<label class="label mt-2 mr-5 col-span-2">
					<span class="h4">Dropoff Date</span>
					<input class="input" type="date" bind:value={dropOffDate} />
				</label>
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label class="label mt-2 col-span-2" bind:this={orderNumElement}>
					<span class="h4">Order Number(s)</span>
					<InputChip
						on:add={onChipAdd}
						on:input={inputChipValidation}
						hidden={true}
						maxlength={5}
						size={0}
						type="text"
						bind:input={referenceNum}
						bind:value={listOfRefNums}
						name="chips"
						placeholder={'0000'}
					/>
				</label>
				<label class="label mt-2 mr-5 col-span-2 row-span-2 overflow-auto">
					<span class="h4">Order Notes: </span>
					<textarea
						bind:value={notes}
						class="textarea"
						rows="2"
						placeholder="Notes for the order"
						autocomplete="off"
					/>
				</label>
				<label class="label mt-3 flex flex-col col-span-1">
					<div>
						<span class="h4">Type of Service</span>
					</div>
					<div class="grid content-between">
						{#each ['Cleaning', 'Alterations'] as service}
							<label>
								<input
									class=""
									type="radio"
									name="serviceType"
									value={service}
									bind:group={typeOfService}
								/>
								{service}
							</label>
						{/each}
					</div>
				</label>
				<div class="mt-3 grid grid-cols-2 col-span-1">
					<p class="col-span-2">
						<span class="h4">Order Status</span>
					</p>
					<label class="flex items-center space-x-2">
						<input bind:checked={paid} class="checkbox" type="checkbox" />
						<p>Paid</p>
					</label>
				</div>
			</div>
		</form>
		<footer class="modal-footer {parent.regionFooter}">
			<button class="btn {parent.buttonNeutral}" on:click={handleReturnToCustomerDetail}
				>Back</button
			>
			<button
				class="btn {parent.buttonPositive}"
				disabled={!(referenceNum || listOfRefNums.length > 0) || !dropOffDate}
				on:click={handleAddNewService}>Create Order</button
			>
		</footer>
	</div>
{/if}
<Toast />
