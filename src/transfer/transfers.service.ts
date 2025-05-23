import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateTransferDto } from './dto/create-tranfer.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';
import { Database } from 'src/Database/db';
import { randomUUID } from 'crypto';
import { UsersService } from 'src/users/users.service';
import { WalletsService } from 'src/wallets/wallets.service';
import { DataTransferDto } from './dto/data-transfer.dto';
import { Transfer } from './entities/transfer.entity';
import { TransferResult } from './dto/transfer-result.dto';

@Injectable()
export class TransfersService {
  constructor(
    private readonly usersService: UsersService,
    private readonly walletsService: WalletsService,
  ) {}

  private create(createTransactionDto: CreateTransferDto): Transfer {
    const id = randomUUID();
    const { value, payer, payee, createdAt, doneAt, status } =
      createTransactionDto;
    const newTransfer: Transfer = new Transfer(
      id,
      value,
      payer,
      payee,
      createdAt,
      doneAt,
      status,
    );
    Database.transfers.push(newTransfer);
    return newTransfer;
  }

  async newTransaction(data: DataTransferDto) {
    if (data.payer === data.payee) {
      throw new BadRequestException("The payer can't be the same as the payee");
    }
    const payer = this.usersService.findOne(data.payer);
    if (!payer) {
      throw new NotFoundException('Payer not found!');
    }
    const payerWallet = this.walletsService.findOne(payer.walletId);
    if (!payerWallet) {
      throw new NotFoundException('Payer wallet not found!');
    }
    if (data.value <= 0 || data.value > payerWallet.value) {
      console.log(data.value < payerWallet.value);
      console.log(data.value + ' ' + payerWallet.value);
      throw new BadRequestException(
        'The value of the tranfer needs to be greater than 0 and less than the amount in payer wallet!',
      );
    }
    const payee = this.usersService.findOne(data.payee);
    if (!payee) {
      throw new NotFoundException('Payee not found!');
    }
    const transaction = await Database.dbTransaction(async () => {
      let transfer = this.create({
        value: data.value,
        payer: data.payer,
        payee: data.payee,
        createdAt: new Date(),
        doneAt: null,
        status: 'PENDING',
      });
      const auth = await fetch('https://util.devi.tools/api/v2/authorize', {
        method: 'GET',
      }).then((res) => {
        console.log(res);
        if (!res.ok) {
          throw new UnauthorizedException('Transfer not authorized!');
        }
        return res;
      });
      this.walletsService.withdraw(payer.walletId, data.value);
      this.walletsService.deposit(payee.walletId, data.value);
      transfer = this.update(transfer.id, {
        status: 'DONE',
        doneAt: new Date(),
      });
      const notification = await fetch(
        'https://util.devi.tools/api/v1/notify',
        { method: 'POST' },
      ).then((res) => {
        return res.ok;
      });
      return {
        status: 201,
        data: transfer,
        authorization: auth.ok,
        notification: notification,
      };
    });
    const dataResult: TransferResult = <TransferResult>transaction.data;
    return dataResult;
  }

  findAll() {
    return Database.transfers;
  }

  findOne(id: string) {
    const transfer = Database.transfers.find(
      (transaction) => transaction.id === id,
    );
    if (!transfer) {
      throw new NotFoundException('Transfer not found!');
    }
    return transfer;
  }

  update(id: string, updateTransactionDto: UpdateTransferDto) {
    const oldData = Database.transfers.find(
      (transaction) => transaction.id === id,
    );
    if (!oldData) {
      throw new NotFoundException('Transfer not found!');
    }
    const transactionIndex = Database.transfers.findIndex(
      (transaction) => transaction.id === id,
    );
    return (Database.transfers[transactionIndex] = new Transfer(
      oldData.id,
      oldData.value,
      oldData.payer,
      oldData.payee,
      oldData.createdAt,
      updateTransactionDto.doneAt
        ? updateTransactionDto.doneAt
        : oldData.doneAt,
      updateTransactionDto.status
        ? updateTransactionDto.status
        : oldData.status,
    ));
  }

  remove(id: string) {
    const transfer = Database.transfers.findIndex(
      (transaction) => transaction.id === id,
    );
    if (!transfer) {
      throw new NotFoundException('Transfer not found!');
    }
    return Database.transfers.splice(transfer, 1);
  }
}
