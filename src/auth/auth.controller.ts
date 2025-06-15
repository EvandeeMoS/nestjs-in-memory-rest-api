import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { Public } from './public.decorator';
import { ApiUnauthorizedResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signIn')
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. Invalid Credentials',
  })
  signIn(@Body(ValidationPipe) credentials: SignInDto) {
    return this.authService.signIn(credentials);
  }
}
