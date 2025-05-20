import { Injectable } from '@nestjs/common';
import { Database } from 'src/db';
import { randomUUID } from 'crypto';
import { CreateUserDto } from './dtos/createUser.dto';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { WalletsService } from 'src/wallets/wallets.service';
import { Wallet } from 'src/wallets/entities/wallet.entity';
import { User } from './model/user.entity';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class UsersService {
    constructor(private readonly walletsService: WalletsService) {}

    findAll() {
        return Database.users;
    }

    findOne(id: string) {
        const user = Database.users.find(user => user.id === id);
        if (!user) {
            throw new NotFoundException('User not found!');
        }
        return user;
    }

    create(data: CreateUserDto) {
        const id = randomUUID();
        const { fullName, document, email, password } = data;
        const wallet: Wallet = this.walletsService.create({value: 0, ownerId: id})!;
        Database.users.push(
            new User(id, fullName, document, email, password, wallet.id)
        );
        return Database.users.find(user => user.id === id);
    }

    update(id: string, data: UpdateUserDto) {
        const oldData = Database.users.find(user => user.id === id);
        if (!oldData) {
            throw new NotFoundException('User not found!');
        }
        const userIndex = Database.users.findIndex(user => user.id === id);
        const { fullName, document, email, password } = data;
        Database.users[userIndex] = new User(
            oldData.id,
            fullName ? fullName : oldData.fullName,
            document ? document : oldData.document,
            email    ? email    : oldData.email,
            password ? password : oldData.password,
            oldData.walletId
        )
        return Database.users.find(user => user.id === id);
    }

    delete(id: string) {
        const userIndex = Database.users.findIndex(user => user.id === id);
        if (userIndex === -1) {
            throw new NotFoundException('User not found!')
        }
        return Database.users.splice(userIndex, 1);
    }
}
