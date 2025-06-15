import { Test, TestingModule } from '@nestjs/testing';
import { TransfersService } from './transfers.service';
import { UsersService } from 'src/users/users.service';
import { WalletsService } from 'src/wallets/wallets.service';
import { Database } from 'src/Database/db';
import { Transfer } from './entities/transfer.entity';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DataTransferDto } from './dto/data-transfer.dto';
import { User } from 'src/users/model/user.entity';
import { UserType } from 'src/users/model/user-type.enum';
import { Wallet } from 'src/wallets/entities/wallet.entity';

describe('TransfersService', () => {
  let service: TransfersService;

  const mockUsersService = {
    findOne: jest.fn((id: string) => {
      return Database.instance.users.find(user => user.id === id)
    }),
    hideDocument: jest.fn((doc: string) => {
      return doc
    }) 
  }
  const mockWalletsService = {
    findOne: jest.fn((id: string) => {
      return Database.instance.wallets.find(wallet => wallet.id === id);
    }),
    withdraw: jest.fn((value: Number) => {}),
    deposit: jest.fn((value: Number) => {})
  }

  const mockTransfer = new Transfer(
    "1",
    200,
    "2",
    "3",
    new Date(),
    new Date(),
    "DONE"
  )

  const mockUser1 = new User(
    "1",
    "User1",
    "12345678911",
    "email@email.coo",
    "password",
    "1",
    UserType.PERSON
  )

  const mockUser2 = new User(
    "2",
    "User2",
    "01234567000199",
    "email@email.col",
    "password",
    "2",
    UserType.SHOPKEEPER
  )

  const mockWallet1 = {
    id: "1",
    value: 200
  }

  const mockWallet2 = {
    id: "2",
    value: 200
  }

  beforeAll(async () => {
    Database.instance.transfers.push(mockTransfer);
    Database.instance.wallets.push(mockWallet1);
    Database.instance.wallets.push(mockWallet2);
    Database.instance.users.push(mockUser1);
    Database.instance.users.push(mockUser2);
  })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransfersService, UsersService, WalletsService],
    })
    .overrideProvider(UsersService)
    .useValue(mockUsersService)
    .overrideProvider(WalletsService)
    .useValue(mockWalletsService)
    .compile();

    service = module.get<TransfersService>(TransfersService);

    const indexUser1 = Database.instance.users.findIndex(user => mockUser1.id);
    Database.instance.users[indexUser1] = mockUser1
    const indexUser2 = Database.instance.users.findIndex(user => mockUser2.id);
    Database.instance.users[indexUser2] = mockUser2
    const indexWallet1 = Database.instance.wallets.findIndex(wallet => mockUser1.id);
    Database.instance.wallets[indexWallet1] = mockWallet1
    const indexWallet2 = Database.instance.wallets.findIndex(wallet => mockUser2.id);
    Database.instance.wallets[indexWallet2] = mockWallet2
  });

  afterEach(async () => {

  })

  afterAll(async () => {
    const indexUser1 = Database.instance.users.findIndex(user => mockUser1.id);
    const indexUser2 = Database.instance.users.findIndex(user => mockUser2.id);
    const indexWallet1 = Database.instance.wallets.findIndex(wallet => mockUser1.id);
    const indexWallet2 = Database.instance.wallets.findIndex(wallet => mockUser2.id);
    Database.instance.users.splice(indexUser1, 1)
    Database.instance.users.splice(indexUser2, 1)
    Database.instance.wallets.splice(indexWallet1, 1)
    Database.instance.wallets.splice(indexWallet2, 1)
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should return an array of Transfers', () => {
    expect(service.findAll()).toEqual(expect.arrayContaining([{
      id: expect.any(String),
      value: expect.any(Number),
      payer: expect.any(String),
      payee: expect.any(String),
      createdAt: expect.any(Date),
      doneAt: expect.any(Date),
      status: expect.any(String)
    }]))
  })

  it('Should return a Transfer with the provided id', () => {
    expect(service.findOne(mockTransfer.id)).toEqual(mockTransfer);
  })

  it('Should throw NotFound, invalid id', () => {
    expect(() => {service.findOne("invalidId")}).toThrow(NotFoundException);
  })

  it('Should create a new Transfer', async () => {
    const mockDataTransfer: DataTransferDto = {payer: mockUser1.id, payee: mockUser2.id, value: 200}
    jest.spyOn(service, 'checkTransferAuthorization').mockImplementation(() => {
      return Promise.resolve({ok: true} as Response)}
    )
    expect(await service.newTransfer(mockDataTransfer)).toEqual({
        status: expect.any(Number),
        data: {
          id: expect.any(String),
          value: mockDataTransfer.value,
          payer: mockDataTransfer.payer,
          payee: mockDataTransfer.payee,
          createdAt: expect.any(Date),
          doneAt: expect.any(Date),
          status: expect.any(String)
        },
        authorization: expect.any(Boolean)
      }
    )
  })

  it('Should throw BadRequest, same payee as payer', async () => {
    const mockDataTransfer: DataTransferDto = {payer: "1", payee: "1", value: 200}
    expect(async () => {await service.newTransfer(mockDataTransfer)}).rejects.toThrow(BadRequestException)
  });

  it('Should throw NotFound, payer not found', async () => {
    const mockDataTransfer: DataTransferDto = {payer: "9999", payee: mockUser2.id, value: 200}
    expect(async () => {await service.newTransfer(mockDataTransfer)}).rejects.toThrow(NotFoundException)
  });

  it('Should throw BadRequest, shopkeepers cannot make transfers', async () => {
    const mockDataTransfer: DataTransferDto = {payer: "2", payee: "1", value: 200}
    expect(async () => {await service.newTransfer(mockDataTransfer)}).rejects.toThrow(BadRequestException)
  });

  it('Should throw NotFound, payer wallet not found', async () => {
    const newMockUser = {...mockUser1}
    newMockUser.walletId = "9999"
    newMockUser.id = "9999"
    Database.instance.users.push(newMockUser)
    const mockDataTransfer: DataTransferDto = {payer: newMockUser.id, payee: "2", value: 200}
    expect(async () => {await service.newTransfer(mockDataTransfer)}).rejects.toThrow(NotFoundException);
  });

  it('Should throw BadRequest, invalid value', async () => {
    const mockDataTransfer: DataTransferDto = {payer: "1", payee: "2", value: -500}
    expect(async () => {await service.newTransfer(mockDataTransfer)}).rejects.toThrow(BadRequestException);
  });

  it('Should throw NotFound, payee not found', async () => {
    const mockDataTransfer: DataTransferDto = {payer: "1", payee: "invalidId", value: 200}
    expect(async () => {await service.newTransfer(mockDataTransfer)}).rejects.toThrow(NotFoundException);
  });

  it('Should throw Unauthorized, transfer not authorized', async () => {
    const mockDataTransfer: DataTransferDto = {payer: "1", payee: "2", value: 200}
    jest.spyOn(service, 'checkTransferAuthorization').mockImplementation(() => {
      return Promise.resolve({ok: false} as Response)}
    )
    expect(async () => {await service.newTransfer(mockDataTransfer)}).rejects.toThrow(UnauthorizedException)
  });

  it('Should return a updated Transfer', async () => {
    const newStatus = "PENDING"
    expect(service.update(mockTransfer.id, {status: newStatus})).toEqual({
        id: mockTransfer.id,
        value: mockTransfer.value,
        payer: mockTransfer.payer,
        payee: mockTransfer.payee,
        createdAt: mockTransfer.createdAt,
        doneAt: mockTransfer.doneAt,
        status: newStatus
      }
    )
  })

  it('Should throw NotFound, transfer not found', async () => {
    const newStatus = "PENDING"
    expect(() => {service.update("InvalidId", {status: newStatus})}).toThrow(NotFoundException)
  })

  it('Should return the deleted Transfer', () => {
    const mockToBeDeleted = {...mockTransfer};
    mockToBeDeleted.id = "99999";
    Database.instance.transfers.push(mockToBeDeleted);
    expect(service.delete(mockToBeDeleted.id)).toEqual({
        id: mockToBeDeleted.id,
        value: mockToBeDeleted.value,
        payer: mockToBeDeleted.payer,
        payee: mockToBeDeleted.payee,
        createdAt: mockToBeDeleted.createdAt,
        doneAt: mockToBeDeleted.doneAt,
        status:mockToBeDeleted.status
      }
    )
  })

  it('Should throw NotFound, transfer not found', async () => {
    expect(() => {service.delete("InvalidId")}).toThrow(NotFoundException)
  })
});

