import { IsEmail, IsNotEmpty, IsOptional, isString, MinLength } from 'class-validator';

export class CreateUserDto {
@IsNotEmpty()
account: number;

@IsEmail()
email: string;

@IsOptional()
fullname: string;


phone: string;

@IsNotEmpty()
@MinLength(6)
PASSWORD: string;

typeUser: string;


}
