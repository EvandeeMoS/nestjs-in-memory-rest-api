import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsStrongPassword,
  IsEnum,
  Length,
} from 'class-validator';
import { UserType } from '../model/user-type.enum';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fullName: string;
  @ApiProperty({
    description: 'CPF or CNPJ',
  })
  @IsString()
  @IsNotEmpty()
  @Length(11, 18)
  document: string;
  @ApiProperty()
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
  @IsNotEmpty()
  @IsEnum(UserType)
  type: UserType;
}
