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
  @ApiProperty({
    description: 'The user full name',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;
  @ApiProperty({
    description: 'Must be CPF or CNPJ',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @Length(11, 18)
  document: string;
  @ApiProperty({
    description: 'The user email',
    type: String,
  })
  @IsEmail()
  email: string;
  @ApiProperty({
    description:
      'The user password, must have at least 8 digits containing: numbers, lower case letters, upper case letters and symbols',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
  @ApiProperty({
    description: 'The type of the user',
    enum: UserType,
  })
  @IsNotEmpty()
  @IsEnum(UserType)
  type: UserType;
}
