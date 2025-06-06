import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

describe('AuthGuard', () => {
  let jwtService: JwtService;
  let reflector: Reflector;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      imports: [JwtService, Reflector],
    }).compile();

    jwtService = testingModule.get<JwtService>(JwtService);
    reflector = testingModule.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(new AuthGuard(jwtService, reflector)).toBeDefined();
  });
});
