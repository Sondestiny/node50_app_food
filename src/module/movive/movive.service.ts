import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMoviveDto } from './dto/create-movive.dto';
import { UpdateMoviveDto } from './dto/update-movive.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Timestamp } from 'rxjs';
import { SearchByDateDto } from './dto/sreach-movie.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class MoviveService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService
  ){}
  async findAll(movie_name_sreach) {
    const movie_list = await this.prisma.movies.findMany({
      where: {
        movie_name: {contains: movie_name_sreach}
      }
    })
    if (!movie_list) throw new NotFoundException('Không tìm thấy tên phim phù hợp')
    return movie_list
  }
  async findAllWithPage(movie_name_sreach, page:number, limit:number) {
    const skip = (page - 1) * limit;
    const where = {movie_name: {contains: movie_name_sreach}}
    const movie_list = await this.prisma.movies.findMany({
      skip: skip,
      take: limit,
      where: where
    })
    const [data, total] = await Promise.all([
      this.prisma.movies.findMany({
      skip: skip,
      take: limit,
      where: where
      }),
      this.prisma.movies.count({where: where})
    ])
    if (!movie_list) throw new NotFoundException('Không tìm thấy tên phim phù hợp')
    return {data, total, page, lastPage: Math.ceil(total / limit)}
  }
  async findAllWithPageAndDay(dto: SearchByDateDto) {
    const {title, startDate, endDate, page = 1, limit = 10} = dto
    const skip = (page - 1) * limit;
    const where :any = {
      ...(title && {
        movie_name: { contains: title, mode: 'insensitive' },
      }),
      show_time: {
        some: {
          date_release: {
        ...(startDate && { gte: new Date(startDate) }),
        ...(endDate && { lte: new Date(endDate) }),
      },
        }
      }
    }
    const data = await this.prisma.movies.findMany({
      skip: skip,
      take: limit,
      orderBy: { movie_name: 'asc' },
      where: where,
      include: {
        ShowTimes: {
          where: {
            date_release: {
              ...(startDate && { gte: new Date(startDate) }),
              ...(endDate && { lte: new Date(endDate) }),
            },
          },
          select: { date_release: true },
        }
      }
    })
    const total = await this.prisma.movies.count({where: where})
  
    if (!data) throw new NotFoundException('Không tìm thấy tên phim phù hợp')
    return {data, total, page, lastPage: Math.ceil(total / limit)}
  }

  findOne(id: number) {
    return `This action returns a #${id} movive`;
  }
  async create(createMoviveDto) {
    return await this.prisma.movies.create({
      data: createMoviveDto
    })
  }

  async updateMovieVideo(
    id: number, 
    dto: UpdateMoviveDto, 
    files: {
      image?: Express.Multer.File[],
      video?: Express.Multer.File[]
    }
  ) {
    // Kiểm tra xem movie muốn update có tồn tại không ?
    const movie = await this.prisma.movies.findUnique({
      where: {id}
    })
    if(!movie) throw new NotFoundException('Movie not found')

    const dataToUpdate: any = { ...dto };

    // upload image lên cloudinary
    if(files.image && files.image.length > 0) {
      // Xóa ảnh cũ trên cloudinary
      if(movie.image) {
        const public_id = this.cloudinary.getPublicIdFromUrl(movie.image);
        await this.cloudinary.deleteFile(public_id)
      }
      // upload ảnh mới
      const imageUpload = await this.cloudinary.uploadImage(files.image[0])
      dataToUpdate.image = imageUpload.secure_url
    }
    
    // upload video lên cloudinary
    if(files.video && files.video.length > 0) {
      // xóa video cũ trên cloudinary
      if(movie.trailer) {
        const public_id = this.cloudinary.getPublicIdFromUrl(movie.trailer);
        await this.cloudinary.deleteFile(public_id)
      }
      // upload video mới lên cloudinary
      const videoUpload = await this.cloudinary.uploadVideo(files.video[0])
      dataToUpdate.trailer = videoUpload.secure_url
    }
    return await this.prisma.movies.update({
      where: {id},
      data: dataToUpdate
    })
  }

  async deleteMovie(movie_id: number) {
    const movie = await this.prisma.movies.findUnique({
      where: {id: movie_id}
    })
    if(!movie) throw new NotFoundException('movie not found');
    // xóa image nếu có
    if(movie.image) {
      const public_id = this.cloudinary.getPublicIdFromUrl(movie.image)
      await this.cloudinary.deleteFile(public_id)
    }
    // xóa video nếu có
    if(movie.trailer) {
      const public_id = this.cloudinary.getPublicIdFromUrl(movie.trailer)
      await this.cloudinary.deleteFile(public_id)
    }
    await this.prisma.movies.delete({
      where: {id: movie_id}
    })
    return { 
      message: 'Movie deleted successfully' ,
      statuscode: 200,

    }
  }
  async getDetail(movie_id:number) {
    const movie = await this.prisma.movies.findUnique({
      where: {id: movie_id}
    })
    if(!movie) throw new NotFoundException('movie not found');
    return movie
  }
}
