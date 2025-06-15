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
                price: true,
                Theaters: {
                    include: {
                        Theater_complexs: {
                            include: {
                                Theater_systems: true
                            }
                        }
                    }
                }
            }
            })
        
        const grouped: Record<number, any> = {};
        for (const show of showTimes) {
            const system = show.Theaters.Theater_complexs.Theater_systems;
            const complexs = show.Theaters.Theater_complexs;
            const theater = show.Theaters;
            if (!grouped[system.id]) {
                grouped[system.id] = {
                    theater_system: {
                        id: system.id,
                        name_theater_system: system.name_theater_system,
                        Theater_complexs: {}
                    }
                }
            }
            if(!grouped[system.id].theater_system.Theater_complexs[complexs.id]) {
                grouped[system.id].theater_system.Theater_complexs[complexs.id] = {
                    id: complexs.id,
                    name_theater_complex: complexs.name_theater_complex,
                    address: complexs.address,
                    theater: {}
                }
            }
            if(!grouped[system.id].theater_system.Theater_complexs[complexs.id].theater[theater.id]) {
                grouped[system.id].theater_system.Theater_complexs[complexs.id].theater[theater.id] = {
                    id: theater.id,
                    theater_name: theater.theater_name,
                    movie: {}
                }
            }
            if(!grouped[system.id].theater_system.Theater_complexs[complexs.id].theater[theater.id].movie[movie.id]) {
                grouped[system.id].theater_system.Theater_complexs[complexs.id].theater[theater.id].movie[movie.id] = {
                    id: movie_id,
                    movie_name: movie.movie_name,
                    showTimes: []
                }
            }
            grouped[system.id].theater_system.Theater_complexs[complexs.id].theater[theater.id].movie[movie.id].showTimes.push({
                date_release: show.date_release,
                price: show.price
            })
        }
        const result = Object.values(grouped)
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
        
        const showTimes = await this.prisma.showTimes.findMany({
            where: filters,
            select: {
                date_release: true,
                price: true,
                Movies: {
                    select: {
                        id: true,
                        movie_name: true,
                        discription: true,
                        image: true,
                        premiere_date: true,
                    }
                },
                Theaters: {
                    include: {
                        Theater_complexs: {
                            include: {
                                Theater_systems: true
                            }
                        }
                    }
                }
              },
            orderBy: {
                date_release: 'asc',
            }
            })
        if(!showTimes) throw new NotFoundException('ShowTime not found')

        const grouped: Record<number, any> = {};
        for (const show of showTimes) {
            const system = show.Theaters.Theater_complexs.Theater_systems;
            const complexs = show.Theaters.Theater_complexs;
            const theater = show.Theaters;
            const movie = show.Movies;

            if (!grouped[system.id]) {
                grouped[system.id] = {
                    theater_system: {
                        id: system.id,
                        name_theater_system: system.name_theater_system,
                        Theater_complexs: {}
                    }
                }
            }
            if(!grouped[system.id].theater_system.Theater_complexs[complexs.id]) {
                grouped[system.id].theater_system.Theater_complexs[complexs.id] = {
                    id: complexs.id,
                    name_theater_complex: complexs.name_theater_complex,
                    address: complexs.address,
                    theater: {}
                }
            }
            if(!grouped[system.id].theater_system.Theater_complexs[complexs.id].theater[theater.id]) {
                grouped[system.id].theater_system.Theater_complexs[complexs.id].theater[theater.id] = {
                    id: theater.id,
                    theater_name: theater.theater_name,
                    movie: {}
                }
            }
            if(!grouped[system.id].theater_system.Theater_complexs[complexs.id].theater[theater.id].movie[movie.id]) {
                grouped[system.id].theater_system.Theater_complexs[complexs.id].theater[theater.id].movie[movie.id] = {
                    id: movie.id,
                    movie_name: movie.movie_name,
                    showTimes: []
                }
            }
            grouped[system.id].theater_system.Theater_complexs[complexs.id].theater[theater.id].movie[movie.id].showTimes.push({
                date_release: show.date_release,
                price: show.price
            })
        }
        const result = Object.values(grouped)
        return result;
    }
}
