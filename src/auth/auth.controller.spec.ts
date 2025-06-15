import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;

  const mockAuthService = {
    signIn: jest.fn().mockImplementation(singInDto => {return {token: "token"}})
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
    .overrideProvider(AuthService)
    .useValue(mockAuthService)
    .compile();

    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('signIn', () => {
    it('should return a token', async () => {
      const mockData = {
        email: "teste@teste.com",
        password: "Teste123@"
      }
      const result = {
        token: expect.any(String)
      }
      expect(await authController.signIn(mockData)).toEqual(result);
    })
  })
});
