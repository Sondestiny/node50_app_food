import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Query, UseGuards, UsePipes, ValidationPipe, ParseIntPipe} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { jwtAuthGuard } from 'src/module/auth/guards/jwt-auth.guard';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { ticketValidationPipe } from 'src/common/pipes/ticket-validation-pipe';

@Controller('QuanLyDatVe')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  // Đạt vé xem phim
  @UseGuards(jwtAuthGuard)
  @Post('DatVe')
  @UsePipes(new ValidationPipe({whitelist: true}))
  create(
    @Request() req,
    @Body(ticketValidationPipe) dto: CreateBookingDto
  ) {
    const account = req.user.account
    console.log(dto)
    return this.bookingsService.create(account, dto);
  }

  // Tìm kiếm danh sách vé theo mã lịch chiếu phim
  @Get('LayDanhSachPhongVe')
  findAll(
    @Query('MaLichChieu', ParseIntPipe) showtime_id: string
  ) {
    return this.bookingsService.findAllBySchedule(Number(showtime_id));
  }
  // Tạo lịch chiếu phim
  @UseGuards(jwtAuthGuard)
  @Post('TaoLichChieu')
  createSchedule(
    @Request() req,
    @Body() dto: CreateScheduleDto
  ) {
    return this.bookingsService.createSchedule(dto);
  }
  
}

