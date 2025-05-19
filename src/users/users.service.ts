import { Injectable } from '@nestjs/common';
import { Database } from 'src/db';
import { randomUUID } from 'crypto';
import { CreateUserDto } from './dtos/createUser.dto';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { WalletsService } from 'src/wallets/wallets.service';
import { Wallet } from 'src/wallets/entities/wallet.entity';

@Injectable()
export class UsersService {
    constructor(private readonly walletsService: WalletsService) {}

    findAll() {
        return Database.users;
    }

    findOne(id: string) {
        return Database.users.find(user => user.id == id);
    }

    create(data: CreateUserDto) {
        const id = randomUUID();
        const wallet: Wallet | undefined = this.walletsService.create({value: 0, ownerId: id})!;
        Database.users.push({id: id, ...data, walletId: wallet.id});
        return Database.users.find(user => user.id === id);
    }

    update(id: string, data: UpdateUserDto) {
        const oldData = Database.users.find(user => user.id == id);
        const userIndex = Database.users.findIndex(user => user.id == id);
        Database.users[userIndex] = {
            id: oldData!.id,
            fullName: data.fullName? data.fullName : oldData!.fullName,
            document: data.document? data.document : oldData!.document,
            email: data.email? data.email : oldData!.email,
            password: data.password? data.password : oldData!.password,
            walletId: data.walletId? data.walletId : oldData!.walletId,
        }
        return Database.users.find(user => user.id == id);
    }

    delete(id: string) {
        return Database.users.splice(Database.users.findIndex(user => user.id == id), 1);
    }
}
