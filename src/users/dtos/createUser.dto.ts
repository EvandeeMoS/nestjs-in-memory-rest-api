import { IsString, IsNotEmpty, IsEmail, MinLength, IsStrongPassword } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    fullName: string;
    @IsString()
    @IsNotEmpty()
    document: string;
    @IsEmail()
    email: string;
    @IsString()
    @IsNotEmpty()
    @IsStrongPassword()
    password: string;
}