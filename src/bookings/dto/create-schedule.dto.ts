import { IsDateString, IsInt, IsNumber, IsString } from 'class-validator';
import { isFloat32Array } from 'node:util/types';
export class CreateScheduleDto {
    @IsInt()
    movie_id;
    @IsDateString()
    date_release;
    @IsInt()
    theater_id;
    @IsInt()
    price
}
