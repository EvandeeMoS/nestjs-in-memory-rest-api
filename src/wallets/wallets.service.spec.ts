import { Test, TestingModule } from '@nestjs/testing';
import { WalletsService } from './wallets.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Wallet } from './entities/wallet.entity';

describe('WalletsService', () => {
  let service: WalletsService;
  let mockWallet: Wallet;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WalletsService],
    }).compile();

    service = module.get<WalletsService>(WalletsService);

    mockWallet = service.create({value: 50});
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should return a array of Wallet', () => {
    expect(service.findAll()).toEqual(expect.arrayContaining([{id: expect.any(String), value: expect.any(Number)}]));
  })

  it('Should return a Wallet', () => {
    expect(service.findOne(mockWallet.id)).toEqual(mockWallet);
  })

  it('Should throw NotFound, invalid id', async () => {
    expect(() => {service.findOne("notvalid")}).toThrow(NotFoundException);
  })

  it('Should return the wallet with updated values', () => {
    expect(service.update(mockWallet.id, {value: 400})).toEqual({id: mockWallet.id, value: 400});
  })

  it('Should throw NotFound, invalid id', () => {
    expect(() => {service.update("notValid", {value: 400})}).toThrow(NotFoundException);
  })

  it('Should return a wallet with new value', () => {
    const oldValue = mockWallet.value;
    expect(service.deposit(mockWallet.id, 40)).toEqual({id: mockWallet.id, value: oldValue + 40});
  })

  it('Should throw BadRequest, invalid value', () => {
    expect(() => {service.deposit(mockWallet.id, 0)}).toThrow(BadRequestException);
  })

  it('Should throw NotFound, invalid id', () => {
    expect(() => {service.deposit("InvalidId", 40)}).toThrow(NotFoundException);
  })

  it('Should return a wallet with new value', () => {
    const oldValue = mockWallet.value;
    expect(service.withdraw(mockWallet.id, 40)).toEqual({id: mockWallet.id, value: oldValue - 40});
  })

  it('Should throw NotFound, invalid id', () => {
    expect(() => {service.withdraw("mockWallet.id", 40)}).toThrow(NotFoundException);
  })

  it('Should throw BadRequest, invalid value', () => {
    expect(() => {service.withdraw(mockWallet.id, mockWallet.value + 80)}).toThrow(BadRequestException);
  })

  it('Should return the removed Wallet', () => {
    expect(service.remove(mockWallet.id)).toEqual(mockWallet);
  })

  it('Should throw NotFound, invalid Id', () => {
    expect(() => {service.remove("InvalidId")}).toThrow(NotFoundException);
  })

});
