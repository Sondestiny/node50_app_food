import { Transform } from "class-transformer";
import { IsDate, IsDateString, IsOptional, IsString, IsUrl} from "class-validator"

export class Body_Create_Movie_Dto {
  @IsOptional()
  @IsString()
  tenPhim: string;

  @IsOptional()
  trailer: Express.Multer.File

  
  @IsOptional()
  image: Express.Multer.File

  @IsOptional()
  @IsString()
  MoTa: string;

  
  @IsOptional()
  @IsDateString()
  ngayKhoiChieu: string;

}

export class Data_Create_Movie_Dto {
  @IsOptional()
  @IsString()
  movie_name: string;

  @IsOptional()
  @IsUrl()
  trailer: string

  
  @IsOptional()
  @IsUrl()
  image: string

  @IsOptional()
  @IsString()
  discription: string;

  
  @IsOptional()
  @IsDate()
  premiere_date: Date;

}
