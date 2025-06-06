import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDto as SignDto } from './dto/sign-in.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(credentials: SignDto) {
    const user = this.userService.findOneByEmail(credentials.email);
    if (!(await bcrypt.compare(credentials.password, user.password))) {
      throw new UnauthorizedException('Wrong password');
    }
    const payload = { sub: user.id, username: user.email };
    const token = await this.jwtService.signAsync(payload);
    return {
      token: token,
    };
  }
}
