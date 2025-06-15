import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsInt, IsNumber, IsPositive, ValidateNested } from 'class-validator';

class ticketDto {
  @IsInt()
  seat_id: number;
  @IsPositive()
  price: number;
}

export class CreateBookingDto {
  @IsNumber()
  @Type( ()=> Number )
  showtime_id: number;
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(()=> ticketDto)
  tickets: ticketDto[];
}
