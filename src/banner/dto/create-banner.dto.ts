import { IsDateString, IsNumber, IsOptional, IsString, IsUrl } from "class-validator"

export class CreateBannerDto {
  @IsNumber()
  movie_id;

  @IsOptional()
  @IsUrl({}, { message: 'image_url must be a valid URL' })
  image;

}
