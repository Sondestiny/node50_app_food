import { Type } from 'class-transformer';
import { IsOptional, IsDateString, IsString, IsInt, Min } from 'class-validator';

export class SearchByDateDto {
  @IsOptional()
  @IsString()
  title?: string;
  @IsOptional()
  @IsDateString()
  startDate?: string;
  @IsOptional()
  @IsDateString()
  endDate?: string;
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 10;
}

export class SearchByPageDto {
  @IsOptional()
  @IsString()
  title?: string;
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 10;
}