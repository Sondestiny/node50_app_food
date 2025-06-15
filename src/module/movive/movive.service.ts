import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMoviveDto } from './dto/create-movive.dto';
import { UpdateMoviveDto } from './dto/update-movive.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Timestamp } from 'rxjs';
import { SearchByDateDto, SearchByPageDto } from './dto/sreach-movie.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class MoviveService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService
  ){}
  // lấy danh sách phim theo tên phim
  async findAll(movie_name_sreach) {
    const movie_list = await this.prisma.movies.findMany({
      where: {
        movie_name: {contains: movie_name_sreach}
      }
    })
    if (!movie_list) throw new NotFoundException('Không tìm thấy tên phim phù hợp')
    return movie_list
  }
  // lấy danh sách phim theo tên phim, phân trang
  async findAllWithPage(dto: SearchByPageDto) {
    const {title, page =1, limit = 10} = dto;
    const skip = (page - 1) * limit;
    const where = {
      movie_name: { 
        contains: title, 
        mode: 'insensitive' 
      }
    }
    const [data, total] = await Promise.all([
      this.prisma.movies.findMany({
      skip: skip,
      take: limit,
      where: where
      }),
      this.prisma.movies.count({where: where})
    ])
    if (!data) throw new NotFoundException('Không tìm thấy tên phim phù hợp')
    return {data, total, page, lastPage: Math.ceil(total / limit)}
  }
  // lấy danh sách phim theo tên phim, có phân trang, có lọc theo ngày
  async findAllWithPageAndDay(dto: SearchByDateDto) {
    const {title, startDate, endDate, page = 1, limit = 10} = dto
    const skip = (page - 1) * limit;
    const where = {
      movie_name: { 
        contains: title, 
        mode: 'insensitive' 
      },
      show_time: {
        some: {
          date_release: {
            ...(startDate && { gte: new Date(startDate) }),
            ...(endDate && { lte: new Date(endDate) }),
          },
        }
      }
    }
    const [data, total] = await Promise.all([
      this.prisma.movies.findMany({
      skip: skip,
      take: limit,
      where: where
      }),
      this.prisma.movies.count({where: where})
    ])
    if (!data) throw new NotFoundException('Không tìm thấy tên phim với ngày chiếu phù hợp')
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
