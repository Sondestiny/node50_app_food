import { IsEmail, IsNotEmpty, IsOptional, isString, MinLength } from 'class-validator';

export class CreateUserDto {
@IsNotEmpty()
account: number;
@IsNotEmpty()
@MinLength(6)
PASSWORD: string;
@IsEmail()
email: string;
phone: string;
TypeUser: string;
@IsOptional()
fullname: string;
}
