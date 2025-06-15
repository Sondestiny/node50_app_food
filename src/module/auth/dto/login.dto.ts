import { Type } from 'class-transformer';
import { IsEmail, IsNumber, MinLength } from 'class-validator';

export class LoginDto {
  @IsNumber()
  @Type( ()=>Number )
  account: number;

  @MinLength(6)
  password: string;
}