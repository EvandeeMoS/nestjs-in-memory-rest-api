import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { Database } from 'src/Database/db';
import { randomUUID } from 'crypto';
import { Wallet } from './entities/wallet.entity';

@Injectable()
export class WalletsService {
  create(createWalletDto: CreateWalletDto): Wallet {
    const id = randomUUID();
    const newWallet: Wallet = new Wallet(id, createWalletDto.value);
    Database.instance.wallets.push(newWallet);
    return newWallet;
  }

  findAll() {
    return Database.instance.wallets;
  }

  findOne(id: string) {
    const wallet = Database.instance.wallets.find((wallet) => wallet.id === id);
    if (!wallet) {
      throw new NotFoundException('Wallet not found!');
    }
    return wallet;
  }

  update(id: string, updateWalletDto: UpdateWalletDto) {
    const oldData = Database.instance.wallets.find((wallet) => wallet.id === id);
    if (!oldData) {
      throw new NotFoundException('Wallet not found!');
    }
    const walletIndex = Database.instance.wallets.findIndex(
      (wallet) => wallet.id === id,
    );
    const { value } = updateWalletDto;
    return (Database.instance.wallets[walletIndex] = new Wallet(
      oldData.id,
      value ? value : oldData.value,
    ));
  }

  deposit(id: string, value: number) {
    if (value <= 0) {
      throw new BadRequestException(
        'Value too low to deposit! The value must be greater than zero!',
      );
    }
    const walletIndex = Database.instance.wallets.findIndex(
      (wallet) => wallet.id === id,
    );
    if (walletIndex === -1) {
      throw new NotFoundException('Wallet not found!');
    }
    Database.instance.wallets[walletIndex].value += value;
    return Database.instance.wallets[walletIndex];
  }

  withdraw(id: string, value: number) {
    const wallet = Database.instance.wallets.find(user => user.id === id);
    if (!wallet) {
      throw new NotFoundException('Wallet not found!');
    }
    if (value > wallet.value) {
      throw new BadRequestException(
        'Value exceeds the amount of money in this wallet!',
      );
    }
    const walletIndex = Database.instance.wallets.findIndex(
      (wallet) => wallet.id === id,
    );
    Database.instance.wallets[walletIndex].value -= value;

    return Database.instance.wallets[walletIndex];
  }

  remove(id: string) {
    const walletIndex = Database.instance.wallets.findIndex(
      (wallet) => wallet.id === id,
    );
    if (walletIndex === -1) {
      throw new NotFoundException('Wallet not found!');
    }
    return Database.instance.wallets.splice(walletIndex, 1)[0];
  }
}
