export class Customer {
	id: string;
	documentId: string;
	lastName: string;
	firstName: string;
	nickname: string;
	phone: string;
	email: string;
	balance: number;
	notes: string;
	searchTerms: string;
	label: string;

	constructor(
		id: string,
		documentId: string,
		lastName: string,
		firstName: string,
		nickname: string,
		phone: string,
		email: string,
		balance: number,
		notes: string,
		searchTerms: string,
		label: string
	) {
		this.id = id;
		this.documentId = documentId;
		this.lastName = lastName;
		this.firstName = firstName;
		this.nickname = nickname;
		this.phone = phone;
		this.email = email;
		this.balance = balance;
		this.notes = notes;
		this.searchTerms = searchTerms;
		this.label = label;
	}
}
