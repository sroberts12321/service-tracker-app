<script lang="ts">	
	import { getModalStore, InputChip } from '@skeletonlabs/skeleton';
	import { notifications } from '$lib/stores/notifications';
	import { writeStore } from '$lib/firebase';
	import Toast from "$lib/Toast.svelte";

    export let parent: any;
	
	let dropOffDate = (new Date()).toJSON().slice(0, 10);
	let paid = false;
	let pickUpDate  = '';
	let pickedUp = false;
	let isReady = false;
	let notes = '';
	let referenceNum: string;
	let lastEnteredRefNum: string;
	let listOfRefNums: string[] = [];
	let typeOfService = 'Cleaning';
	let numValidationRegEx = new RegExp('^[0-9]+$');
	$: if (listOfRefNums.length > 0) {
		iterateRefNum();
	}

	const modalStore = getModalStore();
	const serviceData = $modalStore[0].meta;

    const serviceDetail = {
        serviceId: serviceData.serviceId,
        paid: serviceData.paid,
        pickedUp: serviceData.pickedUp,
		pickUpDate: (new Date()).toJSON().slice(0, 10),
		referenceNum: serviceData.referenceNum,
		notes: serviceData.notes,
		customerId: serviceData.customerId,
        lastName: serviceData.lastName,
        firstName: serviceData.firstName,
        customerName: `${serviceData.lastName}, ${serviceData.firstName}`
    }

	async function handleAddNewService() {
		const uniqueId = crypto.randomUUID();
		if (listOfRefNums.length > 0) {
			referenceNum = listOfRefNums.join(', ');
		}

		let service: any = {
			serviceId: uniqueId,
			customerId: serviceDetail.customerId,	
			dropOffDate: dropOffDate,
			paid: paid,
			isReady: isReady,
			pickUpDate: pickUpDate,
			pickedUp: pickedUp,
			referenceNum: referenceNum,
			typeOfService: typeOfService,
			notes: notes,
		}

		writeStore('services', service).then((returnedSomething) => {
			 JSON.stringify(returnedSomething + ': returned from write store')
		})
		.catch((err) => {
			console.error(err);
		})
		.finally(() => {
			clearForm();
			notifications.success('Service Successfully Saved', 3000);
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
							bind:value={serviceDetail.customerName}
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
        <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>Cancel</button>
            <button class="btn {parent.buttonPositive}" disabled={!(referenceNum || (listOfRefNums.length > 0)) || !serviceDetail.customerName || !dropOffDate}  on:click={handleAddNewService}>Submit Change</button>
    </footer>
	</div>
{/if}
<Toast />
