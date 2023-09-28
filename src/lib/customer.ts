export class Customer {
    id: string;
    lastName: string;
    firstName: string;
    phone: string;
    email: string;
    balance: number;
    notes: string;

    constructor(id: string, lastName: string, firstName: string, phone: string, email: string, balance: number, notes: string) {
        this.id = id;
        this.lastName = lastName;
        this.firstName = firstName;
        this.phone = phone;
        this.email = email;
        this.balance = balance;
        this.notes = notes;
    }
}
