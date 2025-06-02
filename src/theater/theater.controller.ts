import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { TheaterService } from './theater.service';
import { CreateTheaterDto } from './dto/create-theater.dto';
import { UpdateTheaterDto } from './dto/update-theater.dto';

@Controller('QuanLyRap')
export class TheaterController {
  constructor(private readonly theaterService: TheaterService) {}
  @Get('LayThongTinHeThongRap/:maHeThongRap')
  findTheaterSystem(
    @Param('maHeThongRap', ParseIntPipe) theater_id: number
  ) {
    return this.theaterService.findTheaterSystem(theater_id);
  }

  @Get('LayThongTinCumRapTheoHeThong/:maHeThongRap')
  findTheaterComplexBySystem(@Param('maHeThongRap', ParseIntPipe) theater_systems_id: number) {
    return this.theaterService.findTheaterComplexBySystem(theater_systems_id);
  }

  @Get('LayThongTinLichChieuHeThongRap/:maHeThongRap&:maNhom')
  async getShowtimesByTheaterSystem(
    @Param('maHeThongRap', ParseIntPipe) theater_systems_id: number,
    @Param('maNhom', ParseIntPipe) group_id: number
  ) {
  return await this.theaterService.getShowtimesByTheaterSystem(theater_systems_id, group_id)
  }

  @Get('LayThongTinLichChieuPhim/:maPhim')
  async getShowTimeByMovie (
    @Param('maPhim', ParseIntPipe) movie_id: number
  ) {
  return await this.theaterService.getShowTimeByMovie(movie_id)
  }
}
