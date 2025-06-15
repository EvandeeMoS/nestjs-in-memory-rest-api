import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { WalletsService } from 'src/wallets/wallets.service';
import { UserType } from './model/user-type.enum';
import { User } from './model/user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dtos/createUser.dto';
import { InvalidDocumentException } from './errors/InvalidDocument.exception';
import { Database } from 'src/Database/db';

describe('UsersService', () => {
  let service: UsersService;
  const mockUser = {
    id: "028466ef-e2e7-4929-86b1-9b9ce2cd0e1d",
    fullName: "fullname",
    document: "47369788059",
    email: "test@test.com",
    password: "$2b$12$DrLNz1O8sPQ4fQUg93T.UuExzexkenxCpa1R/0NHtvBUGl7/2Iqmu",
    walletId: "2693e70b-cfcb-4af3-8682-c3724da0b09b",
    type: UserType.PERSON
  }
  Database.instance.users.push(mockUser)

  const mockUserCreateData: CreateUserDto = {
    fullName: "fullname2",
    email: "emailTest@testEmail.com",
    document: "399.952.270-45",
    password: "12340987La!",
    type: UserType.PERSON
  }

  const mockWalletService = {
    create: jest.fn(() => {
      return {id: "123444555", value: 300}
    })
  }
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, WalletsService],
    })
    .overrideProvider(WalletsService)
    .useValue(mockWalletService)
    .compile();

    service = module.get<UsersService>(UsersService);

    const index = Database.instance.users.findIndex(user => user.id == mockUser.id)
    if (Database.instance.users[index] != mockUser) {
      Database.instance.users[index] = mockUser;
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should return an array of Users', () => {
    expect(service.findAll()).toEqual(expect.arrayContaining([{
      id: expect.any(String), 
      fullName: expect.any(String),
      document: expect.any(String),
      email: expect.any(String),
      password: expect.any(String),
      walletId: expect.any(String),
      type: UserType.PERSON || UserType.SHOPKEEPER || UserType.ADMIN
    }]))
  })

  it('Should return a User with the provided id', () => {
    expect(service.findOne(mockUser.id)).toEqual(mockUser);
  })

  it('Should throw NotFound, invalid id', () => {
    expect(() => {service.findOne("invalidId")}).toThrow(NotFoundException);
  })

  it('Should return a User with the provided Email', () => {
    expect(service.findOneByEmail(mockUser.email)).toEqual(mockUser);
  })

  it('Should throw NotFound, invalid email', () => {
    expect(() => {service.findOneByEmail("emailNotExist@notExist.com")}).toThrow(NotFoundException);
  })

  it('Should return the created User', async () => {
    expect(await service.create(mockUserCreateData)).toEqual({
      id: expect.any(String), 
      fullName: mockUserCreateData.fullName,
      document: mockUserCreateData.document.replaceAll(".", "").replaceAll("-", ""),
      email: mockUserCreateData.email,
      password: expect.any(String),
      walletId: expect.any(String),
      type: UserType.PERSON
    })
  })

  it('Should throw BadRequest, document already in use', async () => {
    await expect(async () => {await service.create({
      fullName: "fullname", 
      email: "test@test.com", 
      document: "473.697.880-59", 
      password: "1234Ab2!", 
      type: UserType.PERSON
    })}).rejects.toThrow(BadRequestException)
  })

  it('Should throw InvalidDocument, invalid CPF structure', () => {
    const mockWithInvalidCPF = mockUserCreateData;
    mockWithInvalidCPF.type = UserType.PERSON;
    mockWithInvalidCPF.document = "00.00.00.00.001"
    expect(async () => {await service.create(mockWithInvalidCPF)}).rejects.toThrow(InvalidDocumentException)
  })

  it('Should throw InvalidDocument, invalid CPF length', () => {
    const mockWithInvalidCPF = mockUserCreateData;
    mockWithInvalidCPF.document = "222333444000111";
    mockWithInvalidCPF.type = UserType.PERSON;
    expect(async () => {await service.create(mockWithInvalidCPF)}).rejects.toThrow(InvalidDocumentException)
  })

  it('Should throw InvalidDocument, invalid CPF first verifier digit', () => {
    const mockWithInvalidCPF = mockUserCreateData;
    mockWithInvalidCPF.document = "841.238.560-10";
    mockWithInvalidCPF.type = UserType.PERSON;
    expect(async () => {await service.create(mockWithInvalidCPF)}).rejects.toThrow(InvalidDocumentException)
  })

  it('Should throw InvalidDocument, invalid CPF second verifier digit', () => {
    const mockWithInvalidCPF = mockUserCreateData;
    mockWithInvalidCPF.document = "841.238.560-82";
    mockWithInvalidCPF.type = UserType.PERSON;
    expect(async () => {await service.create(mockWithInvalidCPF)}).rejects.toThrow(InvalidDocumentException)
  })

  it('Should receive the full CPF with the first and second verifier digit equal to 0', () => {
    const mockCPF = "237.896.540-00";
    expect(service.validateCPF(mockCPF)).toEqual([[2,3,7,8,9,6,5,4,0,0,0],[0,0]])
  })

  it('Should throw InvalidDocument, invalid CNPJ structure', () => {
    const mockWithInvalidCNPJ = mockUserCreateData;
    mockWithInvalidCNPJ.type = UserType.SHOPKEEPER;
    expect(async () => {await service.create(mockWithInvalidCNPJ)}).rejects.toThrow(InvalidDocumentException)
  })

  it('Should throw InvalidDocument, invalid CNPJ length', () => {
    const mockWithInvalidCNPJ = mockUserCreateData;
    mockWithInvalidCNPJ.document = "222333444000111";
    mockWithInvalidCNPJ.type = UserType.SHOPKEEPER;
    expect(async () => {await service.create(mockWithInvalidCNPJ)}).rejects.toThrow(InvalidDocumentException)
  })

  it('Should throw InvalidDocument, invalid CNPJ first verifier digit', () => {
    const mockWithInvalidCNPJ = mockUserCreateData;
    mockWithInvalidCNPJ.document = "52.056.031/0001-18";
    mockWithInvalidCNPJ.type = UserType.SHOPKEEPER;
    expect(async () => {await service.create(mockWithInvalidCNPJ)}).rejects.toThrow(InvalidDocumentException)
  })

  it('Should throw InvalidDocument, invalid CNPJ second verifier digit', () => {
    const mockWithInvalidCNPJ = mockUserCreateData;
    mockWithInvalidCNPJ.document = "52.056.031/0001-62";
    mockWithInvalidCNPJ.type = UserType.SHOPKEEPER;
    expect(async () => {await service.create(mockWithInvalidCNPJ)}).rejects.toThrow(InvalidDocumentException)
  })

  it('Should receive the full CNPJ with the first and second verifier digit equal to 0', () => {
    const mockCNPJ = "37.761.808/0001-00";
    expect(service.validateCNPJ(mockCNPJ)).toEqual([[3,7,7,6,1,8,0,8,0,0,0,1,0,0],[0,0]])
  })

  it('Should return a hidden CPF', () => {
    expect(service.hideDocument(mockUser)).toEqual("***.***.880-**")
  })

  it('Should return a hidden CNPJ', () => {
    const mockShopkeeper = mockUser;
    mockShopkeeper.document = "37761808000100";
    mockShopkeeper.type = UserType.SHOPKEEPER;
    expect(service.hideDocument(mockShopkeeper)).toEqual("**.***.808/0001-**")
  })

  it('Should throw BadRequest, email already in use', async () => {
    await expect(async () => {await service.create({
      fullName: "fullname", 
      email: "test@test.com", 
      document: "290.028.550-01", 
      password: "1234Ab2!", 
      type: UserType.PERSON
    })}).rejects.toThrow(BadRequestException)
  })

  it('Shoud return the updated User', () => {
    expect(service.update(mockUser.id, {fullName: "newFullName"}))
      .toEqual({
        id: mockUser.id, 
        fullName: "newFullName",
        document: mockUser.document,
        email: mockUser.email,
        password: mockUser.password,
        walletId: mockUser.walletId,
        type: mockUser.type
      })
  })

  it('Should throw NotFound, invalid id', () => {
    expect(() => {service.update("invalidId", {fullName: "newFullName"})}).toThrow(NotFoundException);
  })

  it('Should return the deleted User', () => {
    expect(service.delete(mockUser.id)).toEqual(mockUser);
  })
  
  it('Should throw NotFound, invalid id', () => {
    expect(() => {service.delete("invalidId")}).toThrow(NotFoundException);
  })
});
