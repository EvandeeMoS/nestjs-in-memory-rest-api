export class User {
    id: string;
    fullName: string;
    document: string;
    email: string;
    password: string;
    walletId: string;

    constructor(
        id: string,
        fullName: string,
        document: string,
        email: string,
        password: string,
        walletId: string,
    ) {
        this.id = id;
        this.fullName = fullName;
        this.document = document;
        this.email = email;
        this.password = password;
        this.walletId = walletId;
    }
}