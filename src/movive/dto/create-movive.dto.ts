import { IsDateString, IsOptional, IsString, IsUrl } from "class-validator"

export class CreateMoviveDto {
  @IsString()
  movie_name;

  @IsOptional()
  @IsUrl({}, { message: 'trailer_url must be a valid URL' })
  trailer;

  @IsOptional()
  @IsUrl({}, { message: 'image_url must be a valid URL' })
  image;

  @IsOptional()
  @IsString()
  discription;

  @IsDateString()
  premiere_date;

}
