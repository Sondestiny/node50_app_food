import { Controller, Get, Post, Body,UseInterceptors, Patch, Param, Delete, Query, UploadedFile, Request, UseGuards, ParseIntPipe, UploadedFiles } from '@nestjs/common';
import { MoviveService } from './movive.service';
import { Body_Create_Movie_Dto, Data_Create_Movie_Dto } from './dto/create-movive.dto';
import { Body_Update_Movive_Dto} from './dto/update-movive.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { BannerService } from 'src/module/banner/banner.service';
import { jwtAuthGuard } from 'src/module/auth/guards/jwt-auth.guard';
import { SearchByDateDto, SearchByPageDto } from './dto/sreach-movie.dto';
import { TransformResponseInterceptor } from 'src/common/interceptors/transformResponse.interceptor';
import { setDtoResponse } from 'src/decorator/set-dto-response.decorator';
import { Movie_Response_Dto } from './dto/response-movie.dto';
@UseInterceptors( TransformResponseInterceptor)
@Controller('QuanLyPhim')
export class MoviveController {
  constructor(
    private bannerService: BannerService,
    private readonly moviveService: MoviveService,
    private cloudinary: CloudinaryService
  ) {}
  @Get('LayDanhSachBanner')
  async getBanner (){
    return await this.bannerService.getAll();
  }

  @setDtoResponse(Movie_Response_Dto)
  @Get('LayDanhSachPhim')
  async findAll(
    @Query('maNhom') Group_id :string,
    @Query('tenPhim') movie_name_sreach :string,
    
  ) {
    return await this.moviveService.findAllByName(movie_name_sreach);
  }

  @setDtoResponse(Movie_Response_Dto)
  @Get('LayDanhSachPhimPhanTrang')
  async findAllWithPage(
    @Query() query: SearchByPageDto
  ) {
    return await this.moviveService.getMovieListPaginated(query);
  }

  // lấy danh sách phim theo ngày và phân trang
  @setDtoResponse(Movie_Response_Dto)
  @Get('LayDanhSachPhimTheoNgay')
  async findAllWithPageAndDay(
    @Query() query: SearchByDateDto
  ) {
    return await this.moviveService.findAllWithPageAndDay(query);
  }
  // API tạo phim
  @setDtoResponse(Movie_Response_Dto)
  @Post('ThemPhimUploadHinh')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'image', maxCount: 1 },
    { name: 'trailer', maxCount: 1 },
  ]))
  async create(
    @UploadedFiles() files: {
        image: Express.Multer.File;
        trailer: Express.Multer.File;
    },
    @Body() body: Body_Create_Movie_Dto,
  ) {
    // Kiểm tra xem trong formdata có file ảnh hoặc video không >
    if(!files) throw new Error('Không có file ảnh hoặc trailer để tạo movie')
    
    // upload file hình ảnh vaf video lên cloudinary
    const image_url = await this.cloudinary.uploadImage(files.image[0]);
    const trailer_url = await this.cloudinary.uploadVideo(files.trailer[0]);
    
    // chuyển dữ liệu body sang dto
    const movie_name = body.tenPhim;
    const discription = body.MoTa;
    const premiere_date = new Date( body.ngayKhoiChieu);
    const image = image_url.secure_url
    const trailer = trailer_url.secure_url
    
    return await this.moviveService.create({
      movie_name,
      discription,
      premiere_date,
      image,
      trailer
    });

  }
  // API upLoad phim

  @UseGuards(jwtAuthGuard)
  @setDtoResponse(Movie_Response_Dto)
  @Post('CapNhatPhimUpload')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'image', maxCount: 1 },
    { name: 'trailer', maxCount: 1 },
  ]))
  async update(
    @Request() req,
    @Body() body: Body_Update_Movive_Dto,
    @UploadedFile() 
      files: {
      image: Express.Multer.File[];
      trailer: Express.Multer.File[];
    },
  ){
    // Kiểm tra xem trong formdata có file ảnh hoặc video không >
    if(!files) throw new Error('Không có file ảnh hoặc trailer để tạo movie')
    
    // upload file hình ảnh vaf video lên cloudinary
    const image_url = await this.cloudinary.uploadImage(files.image[0]);
    const trailer_url = await this.cloudinary.uploadVideo(files.trailer[0]);
    
    // chuyển dữ liệu body sang dto
    const movie_name = body.tenPhim;
    const discription = body.moTa;
    const premiere_date = new Date( body.ngayKhoiChieu);
    const image = image_url.secure_url
    const trailer = trailer_url.secure_url

    return await this.moviveService.update({
      movie_name,
      discription,
      premiere_date,
      image,
      trailer
    })
  }

  // Xóa movie
  @UseGuards(jwtAuthGuard)
  @Delete('XP')
  async deleteMovie(
    @Query('id', ParseIntPipe) id: number
  ) {
    return await this.moviveService.deleteMovie(+id);
  }
  @UseGuards(jwtAuthGuard)
  @Delete('XoaPhim')
  async remove(
    @Query('id', ParseIntPipe) id: number
  ) {
    return await this.moviveService.deleteMovie(id);
  }
  // Lấy thông tin chi tiết movie
  @setDtoResponse(Movie_Response_Dto)
  @Get('LayThongTinPhim')
  async getDetail(
    @Query('id', ParseIntPipe) id: number) 
  {
    return await this.moviveService.getDetail(id);
  }
}
