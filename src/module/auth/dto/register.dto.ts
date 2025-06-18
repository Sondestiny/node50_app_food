import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString, isString, MinLength } from 'class-validator';

export class registerDto {
@IsNotEmpty()
@Type(()=> Number)
account: number;

@IsNotEmpty()
@MinLength(6)
PASSWORD: string;

@IsNotEmpty()
@IsString()
@IsEmail()
email: string;

@IsNotEmpty()
@IsString()
phone: string;

@IsString()
@IsNotEmpty()
@IsOptional()
fullname: string;
}
