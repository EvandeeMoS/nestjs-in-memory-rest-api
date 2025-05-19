import { Injectable } from '@nestjs/common';
import { CreateTransferDto } from './dto/create-tranfer.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';
import { Database } from 'src/db';
import { randomUUID } from 'crypto';
import { UsersService } from 'src/users/users.service';
import { WalletsService } from 'src/wallets/wallets.service';
import { Wallet } from 'src/wallets/entities/wallet.entity';
import { DataTransferDto } from './dto/data-transfer.dto';

@Injectable()
export class TransfersService {
  constructor(private readonly usersService: UsersService, private readonly walletsService: WalletsService) {}

  create(createTransactionDto: CreateTransferDto) {
    const id = randomUUID();
    Database.transfers.push({id: id, ...createTransactionDto});
    return Database.transfers.find(transaction => transaction.id === id);
  }

  newTransaction(data: DataTransferDto) {
    try {
      console.log("entrou")
      const payer = this.usersService.findOne(data.payer);
      if (!payer) {
        return "Invalid payer";
      }
      const payerWallet = this.walletsService.findOne(payer.walletId);
      if (!payerWallet) {
        return "This payer don't have a wallet";
      }
      if (data.value < 0 || data.value > payerWallet.value) {
        console.log(data.value < payerWallet.value)
        console.log(data.value + " " + payerWallet.value)
        return "Invalid transaction value"
      }
      console.log("valor válido")
      const payee = this.usersService.findOne(data.payee);
      if (!payee) {
        return "Invalid end user"
      }
      console.log("usuário final válido")
      return Database.dbTransaction(() => {
        const transaction = this.create({
          value: data.value,
          payer: data.payer,
          payee: data.payee,
          createdAt: new Date(),
          doneAt: null,
          status: "PENDING"
        });
        console.log(transaction)
        this.walletsService.withdraw(payer.walletId, data.value);
        this.walletsService.deposit(payee.walletId, data.value);
        this.update(transaction!.id, {status: 'DONE', doneAt: new Date()})
      })
    }
    catch (e) {
      return "erro inesperado"
    }
  }

  findAll() {
    return Database.transfers;
  }

  findOne(id: string) {
    return Database.transfers.find(transaction => transaction.id === id);
  }

  update(id: string, updateTransactionDto: UpdateTransferDto) {
    const oldData = Database.transfers.find(transaction => transaction.id === id);
    if (!oldData) {
      return "Impossível de atualizar, usuário inválido!"
    }
    const transactionIndex = Database.transfers.findIndex(transaction => transaction.id === id);
    return Database.transfers[transactionIndex] = {
      id: oldData.id,
      value: oldData.value,
      payer: oldData.payer,
      payee: oldData.payee,
      createdAt: oldData.createdAt,
      doneAt: updateTransactionDto.doneAt ? updateTransactionDto.doneAt : oldData.doneAt,
      status: updateTransactionDto.status ? updateTransactionDto.status : oldData.status
    };
  }

  remove(id: string) {
    return Database.transfers.splice(Database.transfers.findIndex(transaction => transaction.id === id), 1);
  }
}
