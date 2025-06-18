import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateShowtimeDto } from './dto/create.showtime.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TheaterService } from 'src/module/theater/theater.service';
import * as dayjs from 'dayjs';
import { Prisma } from '@prisma/client';
@Injectable()
export class ShowtimesService {
    constructor(
        private prisma: PrismaService,
    ){}
    // Tạo lịch chiếu phim
    async createShowtime(data: CreateShowtimeDto){
        const {movie_id, date_release, theater_id} = data;
        // kiểm tra ngày chiếu phim (date_release) phải lớn hơn hoặc bằng ngày khởi chiếu của phim (premiere_date);
        const movie = await this.prisma.movies.findUnique({
            where: {
                id: movie_id
            }
        })
        if(!movie) throw new BadRequestException('phim không tồn tại');
        const theater = await this.prisma.theaters.findUnique({
            where: {
                id: theater_id
            }
        })
        if(!theater) throw new BadRequestException('rạp chiếu phim không tồn tại');
        const dateRelease = dayjs(date_release);
        const premiereDate = dayjs(movie.premiere_date )
        if(dateRelease.isBefore(premiereDate)) throw new BadRequestException('Ngày Chiếu phải sau ngày khởi chiếu của phim');

        const showtime = await this.prisma.showTimes.findFirst({
            where: {
                movie_id,
                date_release,
                theater_id
            }
        })
        if(showtime) throw new UnauthorizedException('Lịch chiếu đã tòn tại, không thể thêm');
        const newShowTime = await this.prisma.showTimes.create({
            data: data
        })
        return newShowTime
    }
    // lấy danh sách lịch chiếu phim theo mã phim movie_id
    async getShowTimeByMovie(movie_id:number) {
        const movie = await this.prisma.movies.findUnique({
            where: {
                id: movie_id
            }
        })
        if(!movie) throw new BadRequestException('Bộ phim không tồn tại');
        // lấy giá trị ngày hôm nay
        const today = dayjs().startOf('day').toDate();
        // tạo điều kiện để lấy showtime theo id của movie và ngày chiếu phải lớn hơn ngày hiện tại
        const filters: Prisma.ShowTimesWhereInput = {
            movie_id,
            date_release: {
                gte: today
            }
        }
        const showTimes  = await this.prisma.showTimes.findMany({
            where: filters,
            select: {
                id: true,
                date_release: true,
                theater_id: true,
                price: true,
                Movies: {
                    select: {
                        movie_name: true
                    }
                },
                Theaters: true,
            }
            
            })
        let result: Array<any> = [];
        for ( const showtime of showTimes ) {
            result.push({
                movie_id: movie_id,
                date_release: showtime.date_release,
                theater_id: true,
                price: showtime.price,
                movie_name: showtime.Movies.movie_name,
                theater_name: showtime.Theaters.theater_name

            })
        }
        return result;
    }
    // lấy danh sách thông tin lịch chiếu phim theo mã hệ thống rạp chiếu phim theater_system_id
    async getShowTimeByTheaterSystem(theater_system_id:number) {
        const theater_system = await this.prisma.theater_systems.findUnique({
            where: {
                id: theater_system_id
            }
        })
        if(!theater_system) throw new BadRequestException('Hệ thống rạp chiếu phim không tồn tại')
        // lấy giá trị ngày hôm nay
        const today = dayjs().startOf('day').toDate();
        // tạo điều kiện để lấy showtime theo id của theater_system và ngày chiếu phải lớn hơn ngày hiện tại
        const filters: Prisma.ShowTimesWhereInput = {
            Theaters: {
                    Theater_complexs: {
                        theater_system_id
                    }
                },
                date_release: {
                    gte: today
                }
        }
        
        const showTimes  = await this.prisma.showTimes.findMany({
            where: filters,
            select: {
                id: true,
                date_release: true,
                theater_id: true,
                price: true,
                Movies: {
                    select: {
                        id: true,
                        movie_name: true
                    }
                },
                Theaters: true,
            },
            orderBy: {
                date_release: 'asc'
            }
            })
            let result: Array<any> = [];
        for ( const showtime of showTimes ) {
            result.push({
                movie_id: showtime.Movies.id,
                date_release: showtime.date_release,
                theater_id: true,
                price: showtime.price,
                movie_name: showtime.Movies.movie_name,
                theater_name: showtime.Theaters.theater_name

            })
        }
        return result;
        if(!showTimes) throw new NotFoundException('ShowTime not found')

        
    }
}
