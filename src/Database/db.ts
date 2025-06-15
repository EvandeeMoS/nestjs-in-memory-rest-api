import { UserType } from 'src/users/model/user-type.enum';
import { Transfer } from '../transfer/entities/transfer.entity';
import { User } from '../users/model/user.entity';
import { Wallet } from '../wallets/entities/wallet.entity';
import { TransactionResult } from './dto/transaction-result.dto';

export class Database {
  static #instance: Database;

  users: User[] = [
    {
      id: 'c0d72d77-7512-42a7-a6b0-5281343d6d2c',
      fullName: 'pedro',
      document: '123455678091',
      email: 'email@email.com',
      password: '12345678!aB',
      walletId: 'f24f39fb-d1ff-428e-81ef-430aa98eafa9',
      type: UserType.PERSON,
    },
    {
      id: '94dcd60e-f402-478c-bd82-838de9101390',
      fullName: 'Alek',
      document: '19087654321',
      email: 'email2@email.com',
      password: '12345678!aB',
      walletId: '11645b70-1e9f-4d2a-a2d9-12de49e57ccf',
      type: UserType.PERSON,
    },
  ];
  wallets: Wallet[] = [
    {
      id: 'f24f39fb-d1ff-428e-81ef-430aa98eafa9',
      value: 200,
    },
    {
      id: '11645b70-1e9f-4d2a-a2d9-12de49e57ccf',
      value: 200,
    },
  ];
  transfers: Transfer[] = [];

  private constructor() {}

  public static get instance(): Database {
    if (!Database.#instance) {
      Database.#instance = new Database();
    }

    return Database.#instance;
  }

  async dbTransaction(
    action: () => unknown,
  ): Promise<TransactionResult> {
    const oldUsersTableState = [...this.users];
    const oldWalletTableState = [...this.wallets];
    const oldTransfersTableState = [...this.transfers];
    try {
      const result = await action();
      const transactionResult = new TransactionResult(true, result);
      return transactionResult;
    } catch (e) {
      this.users = oldUsersTableState;
      this.wallets = oldWalletTableState;
      this.transfers = oldTransfersTableState;
      throw e;
    }
  }
}
