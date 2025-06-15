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
import { UserType } from 'src/users/model/user-type.enum';

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
    Database.instance.transfers.push(newTransfer);
    return newTransfer;
  }

  async newTransfer(data: DataTransferDto) {
    if (data.payer === data.payee) {
      throw new BadRequestException("The payer can't be the same as the payee");
    }

    const payer = this.usersService.findOne(data.payer);
    if (!payer) {
      throw new NotFoundException('Payer not found!');
    }
    if (payer.type === UserType.SHOPKEEPER) {
      throw new BadRequestException("Shopkeepers can't make transfers");
    }

    const payerWallet = this.walletsService.findOne(payer.walletId);
    if (!payerWallet) {
      throw new NotFoundException('Payer wallet not found!');
    }
    if (data.value <= 0 || data.value > payerWallet.value) {
      throw new BadRequestException(
        'The value of the tranfer needs to be greater than 0 and less than the amount in payer wallet!',
      );
    }

    const payee = this.usersService.findOne(data.payee);
    if (!payee) {
      throw new NotFoundException('Payee not found!');
    }

    const transaction = await Database.instance.dbTransaction(async () => {
      let transfer = this.create({
        value: data.value,
        payer: data.payer,
        payee: data.payee,
        createdAt: new Date(),
        doneAt: null,
        status: 'PENDING',
      });

      const auth = await this.checkTransferAuthorization()
      
      if (!auth.ok) {
        throw new UnauthorizedException('Transfer not authorized!');
      }

      this.walletsService.withdraw(payer.walletId, data.value);
      this.walletsService.deposit(payee.walletId, data.value);
      transfer = this.update(transfer.id, {
        status: 'DONE',
        doneAt: new Date(),
      });

      fetch('https://util.devi.tools/api/v1/notify', {
        method: 'POST',
        body: JSON.stringify({
          value: data.value,
          payer: payer.fullName,
          payerDocument: this.usersService.hideDocument(payee),
          payee: payee.fullName,
          payeeDocument: this.usersService.hideDocument(payer),
        }),
      })

      return {
        status: 201,
        data: transfer,
        authorization: auth.ok,
      };
    });
    const dataResult: TransferResult = <TransferResult>transaction.data;
    return dataResult;
  }

  findAll() {
    return Database.instance.transfers;
  }

  findOne(id: string) {
    const transfer = Database.instance.transfers.find(
      (transaction) => transaction.id === id,
    );
    if (!transfer) {
      throw new NotFoundException('Transfer not found!');
    }
    return transfer;
  }

  update(id: string, updateTransferDto: UpdateTransferDto) {
    const oldData = Database.instance.transfers.find(
      (transaction) => transaction.id === id,
    );
    if (!oldData) {
      throw new NotFoundException('Transfer not found!');
    }
    const transferIndex = Database.instance.transfers.findIndex(
      (transaction) => transaction.id === id,
    );
    return (Database.instance.transfers[transferIndex] = new Transfer(
      oldData.id,
      oldData.value,
      oldData.payer,
      oldData.payee,
      oldData.createdAt,
      updateTransferDto.doneAt
        ? updateTransferDto.doneAt
        : oldData.doneAt,
      updateTransferDto.status
        ? updateTransferDto.status
        : oldData.status,
    ));
  }

  delete(id: string) {
    const transfer = Database.instance.transfers.findIndex(
      (transfer) => transfer.id === id,
    );
    if (transfer === -1) {
      throw new NotFoundException('Transfer not found!');
    }
    return Database.instance.transfers.splice(transfer, 1)[0];
  }

  async checkTransferAuthorization() {
    return await fetch('https://util.devi.tools/api/v2/authorize', {
      method: 'GET',
    });
  }
}
