export class Customer {
    id: string;
    lastName: string;
    firstName: string;
    phone: string;
    email: string;
    balance: number;

    constructor(id: string, lastName: string, firstName: string, phone: string, email: string, balance: number) {
        this.id = id;
        this.lastName = lastName;
        this.firstName = firstName;
        this.phone = phone;
        this.email = email;
        this.balance = balance;
    }
}
