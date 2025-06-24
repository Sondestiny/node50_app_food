import { IsDate, IsDateString, IsOptional, IsString, IsUrl } from 'class-validator';

export class Body_Update_Movive_Dto {
    @IsOptional()
    @IsString()
    tenPhim?: string;

    @IsOptional()
    trailer: Express.Multer.File
  
    
    @IsOptional()
    image: Express.Multer.File
  
    @IsOptional()
    @IsString()
    moTa: string;
  
    
    @IsOptional()
    @IsDateString()
    ngayKhoiChieu: string;
}

export class Data_Update_Movive_Dto {
    @IsOptional()
    @IsString()
    movie_name?: string;

    @IsOptional()
    @IsUrl()
    trailer: string;
  
    
    @IsOptional()
    @IsUrl()
    image: string;
  
    @IsOptional()
    @IsString()
    discription: string;
  
    
    @IsOptional()
    @IsDate()
    premiere_date: Date;
}