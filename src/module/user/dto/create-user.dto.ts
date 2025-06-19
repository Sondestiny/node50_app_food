import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString, isString, MinLength } from 'class-validator';

export class CreateUserDto {
@IsNotEmpty()
@Type(()=> Number)
account: number;

@IsNotEmpty()
@MinLength(6)
PASSWORD: string;

@IsEmail()
email: string;

@IsString()
phone: string;

@IsString()
group: string;

@IsString()
TypeUser: string;

@IsOptional()
@IsString()
fullname: string;
}
