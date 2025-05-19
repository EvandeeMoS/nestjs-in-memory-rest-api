import { Transfer } from "./transfer/entities/transfer.entity";
import { User } from "./users/model/user.entity";
import { Wallet } from "./wallets/entities/wallet.entity";

export class Database {
    static #instance: Database

    static users: User[] = [];
    static wallets: Wallet[] = [];
    static transfers: Transfer[] = [];
    
    private constructor() {
    }

    public static get instance(): Database {
        if (!Database.#instance) {
            Database.#instance = new Database();
        }

        return Database.#instance;
    }

    static dbTransaction(action: () => void): boolean {
        const oldUsersTableState = Database.users;
        const oldWalletTableState = Database.wallets;
        const oldTransfersTableState = Database.transfers;
        try {
            action();
            return true;
        }
        catch (e) {
            Database.users = oldUsersTableState;
            Database.wallets = oldWalletTableState;
            Database.transfers = oldTransfersTableState;
            return false;
        }
    }

}