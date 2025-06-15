import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class SignInDto {
  @ApiProperty({
    description: 'The user email',
    type: String,
  })
  @IsEmail()
  email: string;
  @ApiProperty({
    description: 'The user password',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}
