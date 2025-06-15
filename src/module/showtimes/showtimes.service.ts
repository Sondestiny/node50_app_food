import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateShowtimeDto } from './dto/create.showtime.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TheaterService } from 'src/module/theater/theater.service';

@Injectable()
export class ShowtimesService {
    constructor(
        private prisma: PrismaService,
    ){}
    async createShowtime(data: CreateShowtimeDto){
        const {movie_id, date_release, theater_id} = data;
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
    async getShowTimeByMovie(movie_id:number) {
        const showTimes  = await this.prisma.showTimes.findMany({
            where: {
                movie_id,
                date_release: {
                    gte: new Date()
                }
            },
            select: {
                date_release: true,
                price: true,
                theater_id: true,
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
                    showTimes: []
                }
            }
            grouped[system.id].theater_system.Theater_complexs[complexs.id].theater[theater.id].showTimes.push({
                movie: movie_id,
                date_release: show.date_release,
                price: show.price,
                theater_id: show.theater_id,
            })
        }
        const result = Object.values(grouped)
        return result;
    }
    async getShowTimeByTheaterSystem(theater_system_id:number) {
        const showtimes = await this.prisma.showTimes.findMany({
            where: {
                Theaters: {
                    Theater_complexs: {
                        theater_system_id
                    }
                }
            },
            select: {
                id:true,
                movie_id: true,
                date_release: true,
                price: true,
                theater_id: true
              },
            orderBy: {
                // date_release: 'asc',
                theater_id: 'asc'
            }
            })
            
        if(!showtimes) throw new NotFoundException('ShowTime not found')
        return showtimes
    }
}
