import { Type } from 'class-transformer';
import { IsEmail, IsNumber, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  account: string;

  @MinLength(6)
  password: string;
}