export class Service {
    id: string;
    dropOffDate: string;
    paid: boolean;
    pickedUp: boolean;
    pickUpDate: string;
    referenceNum: number;
    typeOfService: string;
    searchTerms: string;

    constructor
    (
        id: string, 
        dropOffDate: string, 
        paid: boolean, 
        pickedUp: boolean, 
        pickUpDate: string, 
        referenceNum: number, 
        typeOfService: string, 
        searchTerms: string
    ) {
        this.id = id;
        this.dropOffDate = dropOffDate;
        this.paid = paid;
        this.pickedUp = pickedUp;
        this.pickUpDate = pickUpDate;
        this.referenceNum = referenceNum;
        this.typeOfService = typeOfService;
        this.searchTerms = searchTerms;
    }
}
