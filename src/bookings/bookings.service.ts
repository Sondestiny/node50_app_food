import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';

@Injectable()
export class BookingsService {
  constructor (
    private prisma: PrismaService
  ) {}
  async create(account: number, dto: CreateBookingDto) {
    const {showtime_id, seat_id} = dto
    // Kiểm tra lịch chiếu phim
    const schedule = await this.prisma.showTimes.findUnique({
      where: {id: showtime_id, is_deleted: false}
    })
    if (!schedule) throw new NotFoundException('Lịch chiếu phim không tồn tại')
    // Kiểm tra ghế xem có phù hợp không
    const seat = await this.prisma.seats.findUnique({
    where: {
      id: seat_id,
      theater_id: schedule.theater_id
    }
    })
    if (!seat) throw new NotFoundException('Không tìm thấy ghế phù hợp')
    // Kiểm tra ghế đã được đặt chưa
    const isSeatTaken = await this.prisma.bookings.findFirst({
      where: {showtime_id, seat_id}
    })
    // Tạo booking
    return await this.prisma.bookings.create({
      data: {
        account,
        showtime_id,
        seat_id
      }
    })
  }

  async findAllBySchedule(showtime_id:number) {
    // Kiểm tra lịch chiếu phim
    const schedule = await this.prisma.showTimes.findUnique({
      where: {id: showtime_id, is_deleted: false}
    })
    if (!schedule) throw new NotFoundException('Lịch chiếu phim không tồn tại')
    const ticketList = await this.prisma.bookings.findMany({
    where: {
      showtime_id,
      is_deleted: false}
    })
    return ticketList
    }
  async createSechdule(dto: CreateScheduleDto) {
    const {movie_id,date_release,theater_id,price} = dto
    // Kiểm tra lịch chiếu phim đã có hay chưa
    const schedule = await this.prisma.showTimes.findFirst({
      where: {movie_id,date_release,theater_id}
    })
    if(schedule) throw new NotAcceptableException('Lịch chiếu phim đã có')
    return this.prisma.showTimes.create({
      data: dto
    })
  }
}
