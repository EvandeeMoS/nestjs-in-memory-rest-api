import { UserEntity } from "./users/model/user.entity";

export class Database {
    static #instance: Database

    static users: UserEntity[] = [];
    
    private constructor() {
    }

    public static get instance(): Database {
        if (!Database.#instance) {
            Database.#instance = new Database();
        }

        return Database.#instance;
    }

}