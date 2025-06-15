import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTheaterDto } from './dto/create-theater.dto';
import { UpdateTheaterDto } from './dto/update-theater.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ShowtimesService } from 'src/module/showtimes/showtimes.service';

@Injectable()
export class TheaterService {
  constructor(
    private prisma: PrismaService,
    private showTime: ShowtimesService,
  ) {}
  async findTheaterSystem(id: number) {
    const theater_system =  this.prisma.theater_systems.findUnique({
      where: {
        id
      },
      select: {
        name_theater_system: true,
        logo: true
      }
    })
    if(!theater_system) throw new NotFoundException('Theater not found')
    return theater_system
  }
  async findTheaterComplexBySystem(theater_systems_id:number){
    const theater_complex =  this.prisma.theater_complexs.findMany({
      where: {
        theater_system_id: theater_systems_id
      },
      select: {
        Theaters: {
          select: {
            id: true,
            theater_name: true
          }
        }
      }
    })
    if(!theater_complex) throw new NotFoundException('Theater not found')
    return theater_complex
  }
  async getShowtimesByTheaterSystem(theater_systems_id:number,group_id: string ) {
    const showtimes = await this.showTime.getShowTimeByTheaterSystem(theater_systems_id);
    return showtimes
  }

  async getShowTimeByMovie(movie_id: number) {
    const showTime  = await this.showTime.getShowTimeByMovie(movie_id);
    return showTime
  }
}
