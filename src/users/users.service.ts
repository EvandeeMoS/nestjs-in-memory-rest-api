import { BadRequestException, Injectable } from '@nestjs/common';
import { Database } from 'src/Database/db';
import { randomUUID } from 'crypto';
import { CreateUserDto } from './dtos/createUser.dto';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { WalletsService } from 'src/wallets/wallets.service';
import { Wallet } from 'src/wallets/entities/wallet.entity';
import { User } from './model/user.entity';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InvalidDocumentException } from './errors/InvalidDocument.exception';
import { UserType } from './model/user-type.enum';

@Injectable()
export class UsersService {
  constructor(private readonly walletsService: WalletsService) {}

  findAll() {
    return Database.users;
  }

  findOne(id: string) {
    const user = Database.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    return user;
  }

  async create(data: CreateUserDto) {
    const id = randomUUID();
    const { fullName, document, email, password, type } = data;
    if (type == UserType.PERSON) {
      this.validateCPF(document);
    }
    if (type == UserType.SHOPKEEPER) {
      this.validateCNPJ(document);
    }
    if (Database.users.find((e) => e.document === document)) {
      throw new BadRequestException(
        'This document is already present in our database',
      );
    }
    if (Database.users.find((e) => e.email === email)) {
      throw new BadRequestException(
        'This email is already present in our database',
      );
    }
    const rawDocument = document
      .replaceAll('.', '')
      .replaceAll('-', '')
      .replaceAll('/', '');
    const wallet: Wallet = this.walletsService.create({ value: 0 });
    const hashedPassword: string = await bcrypt.hash(password, 12);
    const newUser: User = new User(
      id,
      fullName,
      rawDocument,
      email,
      hashedPassword,
      wallet.id,
      type,
    );
    Database.users.push(newUser);
    return newUser;
  }

  update(id: string, data: UpdateUserDto) {
    const oldData = Database.users.find((user) => user.id === id);
    if (!oldData) {
      throw new NotFoundException('User not found!');
    }
    const userIndex = Database.users.findIndex((user) => user.id === id);
    const { fullName, document, email, password } = data;
    Database.users[userIndex] = new User(
      oldData.id,
      fullName ? fullName : oldData.fullName,
      document ? document : oldData.document,
      email ? email : oldData.email,
      password ? password : oldData.password,
      oldData.walletId,
      oldData.type,
    );
    return Database.users.find((user) => user.id === id);
  }

  delete(id: string) {
    const userIndex = Database.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException('User not found!');
    }
    return Database.users.splice(userIndex, 1);
  }

  validateCPF(document: string) {
    if (!document.match(/[0-9]{3}[.]?[0-9]{3}[.][0-9]{3}[-]?[0-9]{2}/)) {
      throw new InvalidDocumentException('Invalid CPF estructure');
    }
    document = document.trim().replaceAll('.', '').replaceAll('-', '');
    if (document.length != 11) {
      console.log(document.length, document);
      throw new InvalidDocumentException('Invalid CPF length!');
    }
    const cpfArr = document.split('').map((e) => Number.parseInt(e));
    const variableDigits = cpfArr.slice(0, 9);
    const verifierDigits = cpfArr.slice(9);

    let sum = 0;
    let multiplier = 2;

    for (let i = variableDigits.length - 1; i >= 0; i--) {
      sum += variableDigits[i] * multiplier;
      console.log(
        sum,
        variableDigits[i] * multiplier,
        multiplier,
        variableDigits[i],
      );
      multiplier++;
    }
    let resultDigit1 = sum % 11;
    if (resultDigit1 < 2) {
      resultDigit1 = 0;
    }
    if (resultDigit1 >= 2) {
      resultDigit1 = 11 - resultDigit1;
    }
    if (resultDigit1 != verifierDigits[0]) {
      throw new InvalidDocumentException('User CPF is not valid');
    }

    variableDigits.push(resultDigit1);

    sum = 0;
    multiplier = 2;
    for (let i = variableDigits.length - 1; i >= 0; i--) {
      sum += variableDigits[i] * multiplier;
      console.log(
        sum,
        variableDigits[i] * multiplier,
        multiplier,
        variableDigits[i],
      );
      multiplier++;
    }
    let resultDigit2 = sum % 11;
    if (resultDigit2 < 2) {
      resultDigit2 = 0;
    }
    if (resultDigit2 >= 2) {
      resultDigit2 = 11 - resultDigit2;
    }
    if (resultDigit2 != verifierDigits[1]) {
      throw new InvalidDocumentException('User CPF is not valid');
    }

    variableDigits.push(resultDigit2);

    return [variableDigits, verifierDigits];
  }

  validateCNPJ(document: string) {
    if (
      !document.match(
        /[0-9]{2}[.]?[0-9]{3}[.]?[0-9]{3}[/]?[0-9]{4}[-]?[0-9]{2}/,
      )
    ) {
      throw new InvalidDocumentException('Invalid CNPJ estructure');
    }
    document = document
      .trim()
      .replaceAll('.', '')
      .replaceAll('/', '')
      .replaceAll('-', '');
    if (document.length != 14) {
      throw new InvalidDocumentException('Invalid CNPJ length!');
    }
    const cnpjArr = document.split('').map((e) => Number.parseInt(e));
    const variableDigits = cnpjArr.slice(0, 12);
    const verifierDigits = cnpjArr.slice(12);

    let sum = 0;
    let multiplier = 2;

    for (let i = variableDigits.length - 1; i >= 0; i--) {
      sum += variableDigits[i] * multiplier;
      multiplier++;
      if (multiplier > 9) {
        multiplier = 2;
      }
    }
    let resultDigit1 = sum % 11;
    if (resultDigit1 < 2) {
      resultDigit1 = 0;
    }
    if (resultDigit1 >= 2) {
      resultDigit1 = 11 - resultDigit1;
    }
    if (resultDigit1 != verifierDigits[0]) {
      throw new InvalidDocumentException('User CNPJ is not valid');
    }

    variableDigits.push(resultDigit1);

    sum = 0;
    multiplier = 2;
    for (let i = variableDigits.length - 1; i >= 0; i--) {
      sum += variableDigits[i] * multiplier;
      multiplier++;
      if (multiplier > 9) {
        multiplier = 2;
      }
    }
    let resultDigit2 = sum % 11;
    if (resultDigit2 < 2) {
      resultDigit2 = 0;
    }
    if (resultDigit2 >= 2) {
      resultDigit2 = 11 - resultDigit2;
    }
    if (resultDigit2 != verifierDigits[1]) {
      throw new InvalidDocumentException('User CNPJ is not valid');
    }

    variableDigits.push(resultDigit2);

    return [variableDigits, verifierDigits];
  }

  hideDocument(user: User) {
    if (user.type === UserType.PERSON) {
      return `***.***.${user.document.substring(6, 9)}-**`;
    }
    if (user.type === UserType.SHOPKEEPER) {
      return `**.***.${user.document.substring(5, 8)}/${user.document.substring(8, 12)}-**`;
    }
  }
}
