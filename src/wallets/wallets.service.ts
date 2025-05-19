import { Injectable } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { Database } from 'src/db';
import { randomUUID } from 'crypto';

@Injectable()
export class WalletsService {
  create(createWalletDto: CreateWalletDto) {
    const id = randomUUID();
    Database.wallets.push({
      id: id, 
      value: createWalletDto.value, 
      ownerId: createWalletDto.ownerId
    });
    return Database.wallets.find(wallet => wallet.id === id);
  }

  findAll() {
    return Database.wallets;
  }

  findOne(id: string) {
    return Database.wallets.find(wallet => wallet.id == id);
  }

  update(id: string, updateWalletDto: UpdateWalletDto) {
    const oldData = Database.wallets.find(wallet => wallet.id === id);
    const walletIndex = Database.wallets.findIndex(wallet => wallet.id === id);
    return Database.wallets[walletIndex] = {
      id: oldData!.id,
      value: updateWalletDto.value? updateWalletDto.value : oldData!.value,
      ownerId: oldData!.ownerId
    };
  }

  deposit(id: string, value: number) {
    if (value <= 0) {
      return {
        status: "400",
        message: "Valor inválido para depósito"
      }
    }
    const walletIndex = Database.wallets.findIndex(wallet => wallet.id === id);
    Database.wallets[walletIndex].value += value;

    return Database.wallets[walletIndex];
  }

  withdraw(id: string, value: number) {
    const wallet = this.findOne(id);
    if (!wallet) {
      return "invalid wallet"
    }
    if (value > wallet.value) {
      return {
        status: "400",
        message: "Valor inválido para depósito"
      }
    }
    const walletIndex = Database.wallets.findIndex(wallet => wallet.id === id);
    Database.wallets[walletIndex].value -= value;

    return Database.wallets[walletIndex];
  }

  remove(id: string) {
    return Database.wallets.splice(Database.wallets.findIndex(wallet => wallet.id === id), 1);
  }
}
