import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, Type, UnauthorizedException } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { jwtConstants } from './constants';
import { IS_PUBLIC_KEY } from './public.decorator';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let reflector: Reflector;
  let jwtService: JwtService;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule, 
        JwtModule.register({
          global: true,
          secret: jwtConstants.secret,
          signOptions: { expiresIn: jwtConstants.expiresIn },
        }),
        Reflector
      ],
    })
    .compile();

    reflector = testingModule.get<Reflector>(Reflector);
    jwtService = testingModule.get<JwtService>(JwtService);
    authGuard = new AuthGuard(jwtService, reflector)
  });

  it('should be defined', () => {
    expect(authGuard).toBeDefined();
  });

  it('Should return a Bearer Token', () => {
    const mockExecutionContext = { switchToHttp: () => ({
      getRequest: () => ({
        headers: {
          authorization: "Bearer Token"
        }
      })
    })} as any as ExecutionContext;
    expect(authGuard.extractTokenFromHeader(mockExecutionContext.switchToHttp().getRequest())).toEqual("Token")
  })

  it('Should deny access, no auth header', async () => {
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: null
          }
        }),
        getResponse: () => ({}),
      }),
      getHandler: () => ({}),
      getClass: () => ({})
    } as any as ExecutionContext;
    await expect(authGuard.canActivate(mockExecutionContext)).rejects.toThrow(new UnauthorizedException);
  })

  it('Should deny access, not a valid token', async () => {
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: "Bearer token"
          }
        }),
        getResponse: () => ({}),
      }),
      getHandler: () => ({}),
      getClass: () => ({})
    } as any as ExecutionContext;
    await expect(authGuard.canActivate(mockExecutionContext)).rejects.toThrow(new UnauthorizedException);
  })

  it('Should permit access', async () => {
    const mockToken = await jwtService.signAsync({user: "user", password: "password"})
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: "Bearer " + mockToken
          }
        }),
        getResponse: () => ({}),
      }),
      getHandler: () => ({}),
      getClass: () => ({})
    } as any as ExecutionContext;
    expect(await authGuard.canActivate(mockExecutionContext)).toBe(true)
  })

  it('Should permit access, endpoint is public', async () => {
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: null,
          }
        }),
        getResponse: () => ({}),
      }),
      getHandler: () => ({}),
      getClass: () => ({})
    } as any as ExecutionContext;
    const spy = jest.spyOn(reflector, "getAllAndOverride").mockReturnValue(true)
    expect(await authGuard.canActivate(mockExecutionContext)).toBe(true);
    expect(spy).toHaveBeenCalledTimes(1);
  })
});
