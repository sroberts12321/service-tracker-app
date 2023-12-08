<script lang="ts">	
	import { getModalStore, InputChip, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';
	import CustomerDetail from './CustomerDetail.svelte';
	import { writeStore } from '$lib/firebase';
	import Toast from "$lib/Toast.svelte";
	import { allServices, activeServices } from './stores/customer-store';

    export let parent: any;
	
	$: dropOffDate = convertDate((new Date()).toLocaleDateString(), "initial");
	let paid = false;
	let pickUpDate  = '';
	let pickedUp = false;
	let isReady = false;
	let notes = '';
	let serviceId = '';
	let referenceNum: string;
	let lastEnteredRefNum: string;
	let listOfRefNums: string[] = [];
	let typeOfService = 'Cleaning';
	let numValidationRegEx = new RegExp('^[0-9]+$');
	$: if (listOfRefNums.length > 0) {
		iterateRefNum();
	}

	function convertDate(dateStr: string, dateType: string) {
		let newDateList;
		let month;
		let day; 
		let year;
		let newDate;

		if (dateType === "initial") {
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

		if (dateType === "initial") {
			newDate = `${year}-${month}-${day}`;
		} else {
			newDate = `${month}/${day}/${year}`;
		}

		return newDate;
	}	

	const modalStore = getModalStore();
	const customerData = $modalStore[0].meta;
	let customerName = `${customerData.customerInfo.lastName}, ${customerData.customerInfo.firstName}`;

    const serviceDetail = {
        serviceId: serviceId,
        paid: paid,
        pickedUp: pickedUp,
		dropOffDate: dropOffDate,
		referenceNum: '',
		notes: notes,
		customerId: customerData.customerInfo.id,
        lastName: customerData.customerInfo.lastName,
        firstName: customerData.customerInfo.firstName,
        customerName: `${customerData.customerInfo.lastName}, ${customerData.customerInfo.firstName}`
    }

	function handleReturnToCustomerDetail(closeModal: boolean) {
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
		if (closeModal) {
			modalStore.close();
		}
		modalStore.trigger(settings);
	}

	async function handleAddNewService() {
		const uniqueId = crypto.randomUUID();
		if (listOfRefNums.length > 0) {
			referenceNum = listOfRefNums.join(', ');
		}
		if (!customerData.customerInfo.documentId === undefined) {
			customerData.customerInfo.id = customerData.customerInfo.documentId;
		}

		let service: any = {
			serviceId: uniqueId,
			customerId: customerData.customerInfo.id,	
			dropOffDate: convertDate(dropOffDate, "database"),
			paid: paid,
			pickedUp: pickedUp,
			pickUpDate: pickUpDate,
			isReady: isReady,
			referenceNum: referenceNum,
			typeOfService: typeOfService,
			notes: notes,
		}

		writeStore('services', service).then((returnedSomething) => {
			customerData.activeServices = [...customerData.activeServices, service]
			customerData.allServices = [...customerData.allServices, service]
			modalStore.close();
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
			referenceNum = '1';
		} else {	
			referenceNum = (Number(lastEnteredRefNum) + 1).toString();
		}
	}

	function clearForm() {
    	dropOffDate = (new Date()).toJSON().slice(0, 10);
    	paid = false;
    	typeOfService = 'Cleaning';
		notes = '';
		if (listOfRefNums.length > 0) {
			increment();
		} else {
			referenceNum = (Number(referenceNum) + 1).toString();
		}
		listOfRefNums = [];
	}	

	function inputChipValidation(event: Event) {
		if (event.data != null) {
			if (!numValidationRegEx.test(event.data) || referenceNum.length > 5) {
				referenceNum = referenceNum.slice(0, referenceNum.length - 1);
			}
		}
	}

	function onChipAdd() {
		lastEnteredRefNum = referenceNum;
	}

	function iterateRefNum() {
		if (lastEnteredRefNum != null) {
			increment();
		}
	}		
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';

</script>

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</header>
		<article>{$modalStore[0].body ?? '(body missing)'}</article>
		<form id="orderForm">
				<div class="grid grid-cols-4">
					<label class="label mt-5 mr-5 col-span-2">
						<span class="h4">Customer</span>
						<input
							class="input"
							type="search"
							bind:value={customerName}
							placeholder="Search..."
                            disabled={true}
						/>
					</label>
					<!-- svelte-ignore a11y-label-has-associated-control -->
					<label class="label mt-5 col-span-2">
						<span class="h4">Service Number</span>
						<InputChip on:add={onChipAdd} on:input={inputChipValidation} hidden={true} maxlength={4} size={0} type="text" bind:input={referenceNum} bind:value={listOfRefNums} name="chips" placeholder={"0000"}/>
					</label>
					<label class="label mt-5 mr-5 col-span-2">
						<span class="h4">Dropoff Date</span>
						<input class="input" type="date" bind:value={dropOffDate}/>
					</label>
					<label class="label mt-5 col-span-2 row-span-2">
						<span class="h4">Notes: </span>
						<textarea bind:value={notes} class="textarea" rows="4" placeholder="Notes for the order" />
					</label>
					<label class="label mt-5 mr-5 flex flex-col col-span-1">
						<div>
							<span class="h4">Type of Service</span>
						</div>
						<div class="grid content-between">
							{#each ['Cleaning', 'Alterations'] as service}
								<label>
									<input class="" type='radio' name='serviceType' value={service} bind:group={typeOfService} />
									{service}
								</label>
							{/each}
						</div>
					</label>
					<div class="mt-5 grid grid-cols-2 col-span-1">
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
		<!-- prettier-ignore -->
		<footer class="modal-footer {parent.regionFooter}">
        <button class="btn {parent.buttonNeutral}" on:click={handleReturnToCustomerDetail}>Back</button>
            <button class="btn {parent.buttonPositive}" disabled={!(referenceNum || (listOfRefNums.length > 0)) || !dropOffDate}  on:click={handleAddNewService}>Submit Change</button>
    </footer>
	</div>
{/if}
<Toast />
