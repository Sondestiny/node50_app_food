import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Data_Create_Movie_Dto } from './dto/create-movive.dto';
import { Data_Update_Movive_Dto} from './dto/update-movive.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class MoviveService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
    @Inject(CACHE_MANAGER) private cacheManger: Cache
  ){}
  // lấy danh sách phim theo tên phim
  async findAllByName(movie_name_sreach) {
    const keyCache = `movie:all:${movie_name_sreach}`;
    const dataCache = await this.cacheManger.get(keyCache);

    if (dataCache) return { fromCache: true, data: dataCache };
    const movie_list = await this.prisma.movies.findMany({
      where: {
        movie_name: {contains: movie_name_sreach}
      }
    })
    // Kiểm tra xem movie có tồn tại không ?
    if (!movie_list) throw new NotFoundException('Không tìm thấy tên phim phù hợp')
    return movie_list
  }
  // lấy danh sách phim theo tên phim, phân trang
  async getMovieListPaginated (
    query
  ): Promise<any>{
    console.log(query);
    const title = query.tenPhim;
    const page = query.soTrang;
    const limit = query.soPhanTuTrenTrang;
    
    const skip = (page - 1) * limit;
    const where = {movie_name: { contains: title}}

    const [item, total] = await Promise.all([
      this.prisma.movies.findMany({
        where: where,
        skip: skip,
        take: limit
      }),
      this.prisma.movies.count({
        where: where}
      )
    ])
    // Kiểm tra xem movie có tồn tại không ?
    if (!item) throw new NotFoundException('Không tìm thấy tên phim phù hợp')
    const result = {
            item: item, 
            total,
            page,
            lastPage: Math.ceil(total / limit)
        }
    return result
  }
  // lấy danh sách phim theo tên phim, có phân trang, có lọc theo ngày
  async findAllWithPageAndDay(query) {
    const title = query.tenPhim;
    const page = query.soTrang;
    const limit = query.soPhanTuTrenTrang;
    const startDate = query.tuNgay;
    const endDate = query.denNgay;

    const skip = (page - 1) * limit;

    const where = {
          movie_name: {
            contains: title,
          },
          ShowTimes: {
            some: {
              date_release: {
                gte: new Date(startDate),
                lte: new Date(endDate)
              }
            }
          }
        }
    const [item, total] = await Promise.all([
      this.prisma.movies.findMany({
        skip: skip,
        take: limit,
        where: where
      }),
      this.prisma.movies.count({
        where: where
      })
    ])
    // Kiểm tra xem movie có tồn tại không ?
    if (!item) throw new NotFoundException('Không tìm thấy tên phim với ngày chiếu phù hợp')
    const result = {
            item: item, 
            total, 
            page, 
            lastPage: Math.ceil(total / limit)
        }
    return result
  }
  async create(dto: Data_Create_Movie_Dto) {
    const movie = await this.prisma.movies.findFirst({
      where: {
        movie_name: dto.movie_name,
      }
    })
    if(movie) throw new BadRequestException('Movie đã tồn tại')
    const string_premiere_date = dto.premiere_date;
      return await this.prisma.movies.create({
      data: dto
    })
  }

  async update(dto: Data_Update_Movive_Dto) {
    // Kiểm tra xem movie muốn update có tồn tại không ?
    const movie = await this.prisma.movies.findFirst({
      where: {
        movie_name: dto.movie_name
      }
    })
    if(!movie) throw new NotFoundException('Movie not found')


    // kiểm tra nếu trong dữ liệu dto gửi lên và data đều có image thì xóa image trong dữ liệu trên cloudinary đi
    if(dto.image && movie.image) {
        const public_id = this.cloudinary.getPublicIdFromUrl(movie.image);
        await this.cloudinary.deleteFile(public_id)
    }
    
    // kiểm tra nếu trong dữ liệu dto gửi lên và data đều có trailer thì xóa trailer trong dữ liệu trên cloudinary đi
    if(dto.trailer && movie.trailer) {
        const public_id = this.cloudinary.getPublicIdFromUrl(movie.trailer);
        await this.cloudinary.deleteFile(public_id)
      }
    return await this.prisma.movies.update({
      where: {
        id: movie.id
      },
      data: dto
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
      where: {id: movie_id},
    })
    if(!movie) throw new NotFoundException('movie not found');
    return movie
  }
}
function InjectCacheManager(): (target: typeof MoviveService, propertyKey: undefined, parameterIndex: 2) => void {
  throw new Error('Function not implemented.');
}

