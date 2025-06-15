import { BadRequestException, Injectable, NotAcceptableException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { BookingResponseEntity, TicketEntity } from './entities/booking.entity';

@Injectable()
export class BookingsService {
  constructor (
    private prisma: PrismaService
  ) {}
  async create(account: number, dto: CreateBookingDto): Promise<BookingResponseEntity> {
    const {showtime_id, tickets} = dto
    // Tạo booking
    const result: TicketEntity[] = [];
    for ( const ticket of tickets ) {
      const booking = await this.prisma.bookings.create({
        data: {
          showtime_id,
          account: account,
          seat_id: ticket.seat_id
        },
        include: {
          ShowTimes: {
            include: {
              Theaters: {
                include: {
                  Theater_complexs: {
                    include: {
                      Theater_systems: true
                    }
                  }
                }
              },
              Movies: true
            }
          }
        }
      })
      result.push({
        seat_id: booking.seat_id,
        price: booking.ShowTimes.price,
        start_time: booking.ShowTimes.date_release,
        movie: booking.ShowTimes.Movies.movie_name,
        theater: booking.ShowTimes.Theaters.theater_name,
        theater_complex: booking.ShowTimes.Theaters.Theater_complexs.name_theater_complex,
        theater_system: booking.ShowTimes.Theaters.Theater_complexs.Theater_systems.name_theater_system
      })
    }
    return new BookingResponseEntity(result)
  }
  // Lấy danh sách những ghế đã đặt vé trong lịch chiếu phim cụ thể
  async findAllBySchedule(showtime_id:number) {
    // Kiểm tra lịch chiếu phim
    const showTime = await this.prisma.showTimes.findUnique({
      where: {
        id: showtime_id, 
        is_deleted: false,
        date_release: {
          lte: new Date()
        }
      },
      select: {
        Movies: {
          select: {
            movie_name: true
          }
        },
        Theaters: {
          select: {
            Seats: {
              select: {
                id: true,
                seat_name: true,
                seat_type: true,
              }
            }
          }
        }
      }
    })
    if (!showTime) throw new NotFoundException('Lịch chiếu phim không tồn tại')
      // lây danh sách những ghế đã được đặt
    const bookings = await this.prisma.bookings.findMany({
    where: {
      showtime_id,
      is_deleted: false
    },
    select: {
      seat_id: true,
    }
    })
    const seatBooked = bookings.map( e => e.seat_id);
    var allSeat = showTime.Theaters.Seats;
    const seats = allSeat.map( (e) => {
      return {
        id: e.id,
        seat_name: e.seat_name,
        seat_type: e.seat_type,
        booked: (seatBooked.includes(e.id) ? true : false)
      }
    })
    return {
      showTime: showtime_id,
      seats: seats
    }
  }
  async createSchedule(dto: CreateScheduleDto) {
    const {movie_id,date_release,theater_id,price} = dto
    // Kiểm tra phim có hợp lệ không
    const movie = await this.prisma.movies.findUnique({
      where: {
        id: movie_id
      }
    })
    if (!movie) throw new BadRequestException('MOvie không tồn tại');
    // Kiểm tra rạp chiếu phim có hợp lệ không
    const theater = await this.prisma.theaters.findUnique({
      where: {
        id: theater_id
      }
    })
    if (!theater) throw new BadRequestException('rạp chiếu phim (theater) không tồn tại');
    // Kiểm tra lịch chiếu phim đã có hay chưa
    const schedule = await this.prisma.showTimes.findFirst({
      where: {movie_id,date_release,theater_id}
    })
    // Kiểm tra ngày chiếu phim có hợp lệ không
    
    if(schedule) throw new NotAcceptableException('Lịch chiếu phim đã có')
    return this.prisma.showTimes.create({
      data: dto
    })
  }
}
