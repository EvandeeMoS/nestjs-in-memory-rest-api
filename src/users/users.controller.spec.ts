import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { WalletsService } from 'src/wallets/wallets.service';
import { JwtService } from '@nestjs/jwt';
import { User } from './model/user.entity';
import { UserType } from './model/user-type.enum';
import { CreateUserDto } from './dtos/createUser.dto';
import { UpdateUserDto } from './dtos/updateUser.dto';

describe('UsersController', () => {
  let controller: UsersController;
  const mockUsersService = {
    findAll: jest.fn(() => {
      return [
        new User("0", "fullname", "document", "email", "password", "walletId", UserType.PERSON),
        new User("0", "fullname", "document", "email", "password", "walletId", UserType.SHOPKEEPER)
      ];
    }),
    findOne: jest.fn((id: string) => {
      return new User("0", "fullname", "document", "email", "password", "walletId", UserType.PERSON);
    }),
    create: jest.fn(async (data: CreateUserDto) => {
      return new User("0", "fullname", "document", "email", "password", "walletId", UserType.PERSON);
    }),
    update: jest.fn((id: string, data: UpdateUserDto) => {
      return new User("0", "fullname", "document", "email", "password", "walletId", UserType.PERSON);
    }),
    delete: jest.fn(() => {
      return new User("0", "fullname", "document", "email", "password", "walletId", UserType.PERSON);
    })
  }

  const mockWalletsService = {}
  const mockJwtService = {}


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, WalletsService, JwtService]
    })
    .overrideProvider(UsersService)
    .useValue(mockUsersService)
    .overrideProvider(WalletsService)
    .useValue(mockWalletsService)
    .overrideProvider(JwtService)
    .useValue(mockJwtService)
    .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Should return an array of Users', () => {
    expect(controller.findAll()).toEqual(expect.arrayContaining([
        {
          id: expect.any(String), 
          fullName: expect.any(String),
          document: expect.any(String),
          email: expect.any(String),
          password: expect.any(String),
          walletId: expect.any(String),
          type: UserType.PERSON || UserType.SHOPKEEPER || UserType.ADMIN
        }
      ]))
  })

  it('Should return a User', () => {
    expect(controller.findOne("0")).toEqual({
          id: expect.any(String), 
          fullName: expect.any(String),
          document: expect.any(String),
          email: expect.any(String),
          password: expect.any(String),
          walletId: expect.any(String),
          type: UserType.PERSON || UserType.SHOPKEEPER || UserType.ADMIN
        })
  })

  it('Should return a User', async () => {
    expect(await controller.create({
      fullName: "fullname", 
      document: "document", 
      email: "email", 
      password: "password",
      type: UserType.PERSON,
    }))
    .toEqual({
      id: expect.any(String), 
      fullName: expect.any(String),
      document: expect.any(String),
      email: expect.any(String),
      password: expect.any(String),
      walletId: expect.any(String),
      type: UserType.PERSON || UserType.SHOPKEEPER || UserType.ADMIN
    })
  })

  it('Should return a User', () => {
    expect(controller.update("0", {fullName: "full-name"})).toEqual({
      id: expect.any(String), 
      fullName: expect.any(String),
      document: expect.any(String),
      email: expect.any(String),
      password: expect.any(String),
      walletId: expect.any(String),
      type: UserType.PERSON || UserType.SHOPKEEPER || UserType.ADMIN
    })
  })

  it('Should return a User', () => {
    expect(controller.delete("0")).toEqual({
      id: expect.any(String), 
      fullName: expect.any(String),
      document: expect.any(String),
      email: expect.any(String),
      password: expect.any(String),
      walletId: expect.any(String),
      type: UserType.PERSON || UserType.SHOPKEEPER || UserType.ADMIN
    })
  })
});
