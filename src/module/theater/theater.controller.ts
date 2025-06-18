import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { TheaterService } from './theater.service';
import { CreateTheaterDto } from './dto/create-theater.dto';
import { UpdateTheaterDto } from './dto/update-theater.dto';
import { setResponseMessage } from 'src/decorator/response-message.decorator';

@Controller('QuanLyRap')
export class TheaterController {
  constructor(private readonly theaterService: TheaterService) {}
  @Get('LayThongTinHeThongRap')
  async findTheaterSystem(
    @Query('maHeThongRap', ParseIntPipe) theater_systems_id: number,
  ) {
    return await this.theaterService.getTheaterSystemÌno(theater_systems_id);
  }
  @Get('LayThongTinCumRapTheoHeThong')
  @setResponseMessage('Lấy thông tin lịch chiếu cụm rạp theo mã hệ thống rạp thành công')
  async findTheaterComplexBySystem(
    @Query('maHeThongRap', ParseIntPipe) theater_systems_id: number,
  ) {
    return await this.theaterService.findTheaterComplexBySystem(theater_systems_id);
  }

  @Get('LayThongTinLichChieuHeThongRap')
  async getShowtimesByTheaterSystem(
    @Query('maHeThongRap', ParseIntPipe) theater_systems_id: number,
    @Query('maNhom') group_id: string
  ) {
  return await this.theaterService.getShowtimesByTheaterSystem(theater_systems_id, group_id)
  }

  @Get('LayThongTinLichChieuPhim')
  async getShowTimeByMovie (
    @Query('maPhim', ParseIntPipe) movie_id: number
  ) {
  return await this.theaterService.getShowTimeByMovie(movie_id)
  }
}
