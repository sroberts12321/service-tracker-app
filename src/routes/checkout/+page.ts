import type { PageLoad } from './$types';
import { readStore } from '$lib/firebase';

let servicesStore: any[] = [];
let customerRef = '';
let dropOffDate = '';
let paid: boolean = false;
let pickUpDate = '';
let pickedUp: boolean = false;
let referenceNum = '';
let typeOfService = '';
let notes = '';
let service: any = {
    customerRef, 
    dropOffDate, 
    paid,
    pickUpDate,
    pickedUp, 
    referenceNum,
    typeOfService,
    notes
};
export const load = (async () => {
	const getServices = async () => {
		const res = await readStore('services')
		.then((returnedServices) => {
			servicesStore = [];
			 returnedServices.forEach((doc) => {
				service = {
					id: doc.id,
					dropOffDate: doc.get('dropOffDate'),
					paid: doc.get('paid'),
					pickUpDate: doc.get('pickUpDate'),
					pickedUp: doc.get('pickedUp'),
                    referenceNum: doc.get('referenceNum'),
                    typeOfService: doc.get('typeOfService'),
					notes: doc.get('notes')
				}
				if (service.notes === undefined) {
					service.notes = ' ';
				}
				servicesStore = [...servicesStore, service];
			});
		})
		.catch((err) => {
			console.error(err);
		})
		.finally(() => {
			console.log('customer fetching successful');
		})
		return servicesStore;
	}
    return {
        services: getServices(),
		    }
}) satisfies PageLoad;