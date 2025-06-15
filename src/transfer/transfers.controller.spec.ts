import { Test, TestingModule } from '@nestjs/testing';
import { TransfersController } from './transfers.controller';
import { TransfersService } from './transfers.service';
import { UsersService } from 'src/users/users.service';
import { WalletsService } from 'src/wallets/wallets.service';
import { Transfer } from './entities/transfer.entity';
import { DataTransferDto } from './dto/data-transfer.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';

describe('TransfersController', () => {
  let controller: TransfersController;

  const mockUsersService = {}
  const mockWalletsService = {}
  const mockTransfersService = {
    findAll: jest.fn((id: string) => {
      return [
        new Transfer(
          "0",
          100,
          "0",
          "1",
          new Date(),
          new Date(),
          "DONE"
        ),
        new Transfer(
          "1",
          100,
          "1",
          "0",
          new Date(),
          new Date(),
          "DONE"
        )
      ]
    }),
    findOne: jest.fn((id: string) => {
      return new Transfer(
        "0",
        100,
        "0",
        "1",
        new Date(),
        new Date(),
        "DONE"
      )
    }),
    newTransfer: jest.fn((data: DataTransferDto) => {
      return new Transfer(
        "0",
        data.value,
        data.payer,
        data.payee,
        new Date(),
        new Date(),
        "DONE"
      )
    }),
    update: jest.fn((id: string, data: UpdateTransferDto) => {
      return new Transfer(
        "0",
        100,
        "0",
        "1",
        new Date(),
        new Date(),
        "DONE"
      )
    }),
    delete: jest.fn((id: string) => {
      return new Transfer(
        "0",
        100,
        "0",
        "1",
        new Date(),
        new Date(),
        "DONE"
      )
    })
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransfersController],
      providers: [TransfersService, UsersService, WalletsService],
    })
    .overrideProvider(TransfersService)
    .useValue(mockTransfersService)
    .overrideProvider(UsersService)
    .useValue(mockUsersService)
    .overrideProvider(WalletsService)
    .useValue(mockWalletsService)
    .compile();

    controller = module.get<TransfersController>(TransfersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Should return an array of Transfers', () => {
    expect(controller.findAll()).toEqual(expect.arrayContaining([{
      id: expect.any(String),
      value: expect.any(Number),
      payer: expect.any(String),
      payee: expect.any(String),
      createdAt: expect.any(Date),
      doneAt: expect.any(Date),
      status: expect.any(String)
    }]))
  })

  it('Should return a Transfer', () => {
    expect(controller.findOne("0")).toEqual({
      id: expect.any(String),
      value: expect.any(Number),
      payer: expect.any(String),
      payee: expect.any(String),
      createdAt: expect.any(Date),
      doneAt: expect.any(Date),
      status: expect.any(String)
    })
  })

  it('Should return the created Transfer', () => {
    const data = {
      payer: "2",
      payee: "3",
      value: 2000
    }
    expect(controller.newTransfer(data)).toEqual({
      id: expect.any(String),
      value: data.value,
      payer: data.payer,
      payee: data.payee,
      createdAt: expect.any(Date),
      doneAt: expect.any(Date),
      status: expect.any(String)
    })
  })

  it('Should return a Transfer', () => {
    const data = {
      payer: "2",
      payee: "3",
      value: 2000
    }
    expect(controller.update("1", data)).toEqual({
      id: expect.any(String),
      value: expect.any(Number),
      payer: expect.any(String),
      payee: expect.any(String),
      createdAt: expect.any(Date),
      doneAt: expect.any(Date),
      status: expect.any(String)
    })
  })

  it('Should return a Transfer', () => {
    expect(controller.remove("0")).toEqual({
      id: expect.any(String),
      value: expect.any(Number),
      payer: expect.any(String),
      payee: expect.any(String),
      createdAt: expect.any(Date),
      doneAt: expect.any(Date),
      status: expect.any(String)
    })
  })
});
