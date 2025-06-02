import { IsEmail, IsNumber, MinLength } from 'class-validator';

export class LoginDto {
  @IsNumber()
  account: number;

  @MinLength(6)
  password: string;
}