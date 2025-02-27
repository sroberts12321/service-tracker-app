import { Timestamp } from 'firebase/firestore';
export class Service {
	customerId: string;
	serviceId: string;
	dropOffDate: string;
	paid: boolean;
	pickedUp: boolean;
	pickUpDate: string;
	isReady: boolean;
	referenceNum: string;
	typeOfService: string;
	notes: string;
	expirationDate: Timestamp;

	constructor(
		customerId: string,
		serviceId: string,
		dropOffDate: string,
		paid: boolean,
		pickedUp: boolean,
		pickUpDate: string,
		isReady: boolean,
		referenceNum: string,
		typeOfService: string,
		notes: string,
		expirationDate: Timestamp
	) {
		this.customerId = customerId;
		this.serviceId = serviceId;
		this.dropOffDate = dropOffDate;
		this.paid = paid;
		this.pickedUp = pickedUp;
		this.pickUpDate = pickUpDate;
		this.isReady = isReady;
		this.referenceNum = referenceNum;
		this.typeOfService = typeOfService;
		this.notes = notes;
		this.expirationDate = expirationDate;
	}
}
