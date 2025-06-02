import { IsOptional, IsString } from 'class-validator';

export class UpdateMoviveDto {
  @IsOptional()
  @IsString()
  movie_name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}