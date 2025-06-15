import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { WalletsService } from 'src/wallets/wallets.service';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;

  const mockUserService = {
    findOneByEmail: jest.fn(id => {
      return {
        id: id,
        email: "teste@teste.com",
        password: bcrypt.hashSync("password", 12),
      }
    })
  }

  const mockJwtService = {
    signAsync: jest.fn().mockImplementation(async (payload) => {
      return "token"
    })
  }

  const mockWalletsService = {}

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UsersService, JwtService, WalletsService],
    })
    .overrideProvider(UsersService)
    .useValue(mockUserService)
    .overrideProvider(JwtService)
    .useValue(mockJwtService)
    .overrideProvider(WalletsService)
    .useValue(mockWalletsService)
    .compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should throw unauthorized, wrong password', async () => {
    const mockCredentials = {
        email: "teste@teste.com",
        password: "password2",
    }
    expect(async () => await service.signIn(mockCredentials)).rejects.toThrow(UnauthorizedException)
  })

  it('Should return a token', async () => {
    const mockCredentials = {
        email: "teste@teste.com",
        password: "password",
    }
    expect(await service.signIn(mockCredentials)).toEqual({token: expect.any(String)})
  })
});
