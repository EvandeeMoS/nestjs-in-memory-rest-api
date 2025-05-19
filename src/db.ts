import { User } from "./users/model/user.entity";
import { Wallet } from "./wallets/entities/wallet.entity";

export class Database {
    static #instance: Database

    static users: User[] = [];
    static wallets: Wallet[] = [];
    
    private constructor() {
    }

    public static get instance(): Database {
        if (!Database.#instance) {
            Database.#instance = new Database();
        }

        return Database.#instance;
    }

}