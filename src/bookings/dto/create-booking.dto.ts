import { IsInt, IsNumber, IsString } from 'class-validator';
export class CreateBookingDto {
  @IsInt()
  showtime_id: number;

  @IsNumber()
  seat_id: number;
}
