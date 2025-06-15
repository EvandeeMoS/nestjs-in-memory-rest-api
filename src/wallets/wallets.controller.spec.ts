import { Test, TestingModule } from '@nestjs/testing';
import { WalletsController } from './wallets.controller';
import { WalletsService } from './wallets.service';
import { Wallet } from './entities/wallet.entity';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';

describe('WalletsController', () => {
  let controller: WalletsController;

  const mockWalletsService = {
    findAll: jest.fn(() => [
        new Wallet("0", 0),
        new Wallet("1", 1),
      ]
    ),
    findOne: jest.fn((id: string) => new Wallet(id, 0)),
    create: jest.fn((createWalletDto: CreateWalletDto) => {
      return {
        id: "0",
        ...createWalletDto
      };
    }),
    deposit: jest.fn((id: string, value: number) => {
      return new Wallet(id, value);
    }),
    withdraw: jest.fn((id: string, value: number) => {
      return new Wallet(id, value);
    }),
    update: jest.fn((id: string, updateData: UpdateWalletDto) => {
      return new Wallet(id, updateData.value? updateData.value : 0);
    }),
    remove: jest.fn((id: string) => {
      return new Wallet(id, 0);
    })
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalletsController],
      providers: [WalletsService],
    })
    .overrideProvider(WalletsService)
    .useValue(mockWalletsService)
    .compile();

    controller = module.get<WalletsController>(WalletsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Should return an array of Wallets', () => {
    expect(controller.findAll()).toEqual(expect.arrayContaining([{id: expect.any(String), value: expect.any(Number)}]))
  })

  it('Should return a Wallet', () => {
    expect(controller.findOne("3")).toEqual(expect.any(Wallet))
  })

  it('Should return the created Wallet', () => {
    const mockCreateWalletDto = {value: 1000}
    expect(controller.create(mockCreateWalletDto)).toEqual({id: expect.any(String), ...mockCreateWalletDto})
  })

  it('Should return a wallet with the deposited value', () => {
    const mockCreateWalletDto: CreateWalletDto = {value: 1000}
    expect(controller.deposit("0", mockCreateWalletDto)).toEqual({id: "0", ...mockCreateWalletDto})
  })

  it('Should return a wallet with the withdrew value', () => {
    const mockCreateWalletDto: CreateWalletDto = {value: 1000}
    expect(controller.withdraw("0", mockCreateWalletDto)).toEqual({id: "0", ...mockCreateWalletDto})
  })

  it('Should return a wallet with the updated value', () => {
    const mockCreateWalletDto: UpdateWalletDto = {value: 1000}
    expect(controller.update("0", mockCreateWalletDto)).toEqual({id: "0", value: expect.any(Number)})
  })

  it('Should return the removed wallet', ()  => {
    expect(controller.remove("0")).toEqual({id: "0", value: expect.any(Number)})
  })
});
