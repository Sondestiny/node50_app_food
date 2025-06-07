import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTheaterDto } from './dto/create-theater.dto';
import { UpdateTheaterDto } from './dto/update-theater.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundError } from 'rxjs';

@Injectable()
export class TheaterService {
  constructor(
    private prisma: PrismaService
  ) {}
  async findTheaterSystem(id: number) {
    const theater_system =  this.prisma.theater_systems.findUnique({
      where: {
        id
      },
      select: {
        name_theater_system: true,
        Theater_complexs: {
          select: {
            name_theater_complex: true,
            Theaters: {
              select: {
                theater_name: true,
              }
            }
          }
        },
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
      include: {
        Theaters: true
      }
    })
    if(!theater_complex) throw new NotFoundException('Theater not found')
    return theater_complex
  }
  async getShowtimesByTheaterSystem(theater_systems_id:number,group_id: string ) {
    const showtimes = await this.prisma.showTimes.findMany({
      select: {
        Movies: {
          select: {
            movie_name: true,
            discription: true,
            review: true
          }
        },
        Theaters: {
          select: {
            theater_name: true,
            Theater_complexs: {
              select: {
                name_theater_complex: true,
                Theater_systems: true
              }
            }
          }
        }
      }
    })
    console.log(showtimes)
    if(!showtimes) throw new NotFoundException('ShowTime not found')
    return showtimes
  }

  async getShowTimeByMovie(movie_id: number) {

  }
}
