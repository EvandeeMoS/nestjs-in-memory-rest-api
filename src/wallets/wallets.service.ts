import { Injectable } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { Database } from 'src/db';
import { randomUUID } from 'crypto';

@Injectable()
export class WalletsService {
  create(createWalletDto: CreateWalletDto) {
    return Database.wallets.push({
      id: randomUUID(), 
      value: createWalletDto.value, 
      ownerId: createWalletDto.ownerId
    });
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

  remove(id: string) {
    return Database.wallets.splice(Database.wallets.findIndex(wallet => wallet.id === id), 1);
  }
}
