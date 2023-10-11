export class Customer {
    id: string;
    lastName: string;
    firstName: string;
    nickname: string;
    phone: string;
    email: string;
    balance: number;
    notes: string;
    searchTerms: string;

    constructor(id: string, lastName: string, firstName: string, nickname: string, phone: string, email: string, balance: number, notes: string, searchTerms: string) {
        this.id = id;
        this.lastName = lastName;
        this.firstName = firstName;
        this.nickname = nickname;
        this.phone = phone;
        this.email = email;
        this.balance = balance;
        this.notes = notes;
        this.searchTerms = searchTerms;
    }
}
