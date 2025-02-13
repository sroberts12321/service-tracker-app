export class Service {
	customerId: string;
	id: string;
	dropOffDate: string;
	paid: boolean;
	pickedUp: boolean;
	pickUpDate: string;
	isReady: boolean;
	referenceNum: string;
	typeOfService: string;
	notes: string;

	constructor(
		customerId: string,
		id: string,
		dropOffDate: string,
		paid: boolean,
		pickedUp: boolean,
		pickUpDate: string,
		isReady: boolean,
		referenceNum: string,
		typeOfService: string,
		notes: string
	) {
		this.customerId = customerId;
		this.id = id;
		this.dropOffDate = dropOffDate;
		this.paid = paid;
		this.pickedUp = pickedUp;
		this.pickUpDate = pickUpDate;
		this.isReady = isReady;
		this.referenceNum = referenceNum;
		this.typeOfService = typeOfService;
		this.notes = notes;
	}
}
