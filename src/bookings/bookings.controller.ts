import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Query, UseGuards} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { jwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateScheduleDto } from './dto/create-schedule.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @UseGuards(jwtAuthGuard)
  @Post('DatVe')
  create(
    @Request() req,
    @Body() createBookingDto: CreateBookingDto
  ) {
    const account = req.user.account
    return this.bookingsService.create(account, createBookingDto);
  }

  // Tìm kiếm danh sách vé theo mã lịch chiếu phim
  @Get('LayDanhSachPhongVe')
  findAll(
    @Query('MaLichChieu') showtime_id: string
  ) {
    return this.bookingsService.findAllBySchedule(Number(showtime_id));
  }
  @UseGuards(jwtAuthGuard)
  @Post('TaoLichChieu')
  createSchedule(
    @Request() req,
    @Body() dto: CreateScheduleDto
  ) {
    return this.bookingsService.createSechdule(dto);
  }
  
}

