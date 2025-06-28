import { Type } from 'class-transformer';
import { IsOptional, IsDateString, IsString, IsInt, Min } from 'class-validator';

export class SearchByDateDto {
  @IsOptional()
  @IsString()
  tenPhim?: string;

  @IsOptional()
  @IsDateString()
  tuNgay?: string;
  @IsOptional()
  @IsDateString()
  denNgay?: string;
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  soTrang?: number = 1;
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  soPhanTuTrenTrang?: number = 10;
}

export class SearchByPageDto {
  @IsOptional()
  @IsString()
  tenPhim?: string;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  soTrang?: number = 1;
  
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  soPhanTuTrenTrang?: number = 10;
}