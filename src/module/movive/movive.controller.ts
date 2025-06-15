import { Controller, Get, Post, Body,UseInterceptors, Patch, Param, Delete, Query, UploadedFile, Request, UseGuards, ParseIntPipe } from '@nestjs/common';
import { MoviveService } from './movive.service';
import { CreateMoviveDto } from './dto/create-movive.dto';
import { UpdateMoviveDto } from './dto/update-movive.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { BannerService } from 'src/module/banner/banner.service';
import { jwtAuthGuard } from 'src/module/auth/guards/jwt-auth.guard';
@Controller('api/QuanLyPhim')
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
  @Get('LayDanhSachPhim')
  findAll(
    @Query('maNhom') Group_id :string,
    @Query('tenPhim') movie_name_sreach :string,
    
  ) {
    return this.moviveService.findAll(movie_name_sreach);
  }
  @Get('LayDanhSachPhimPhanTrang')
  findAllWithPage(
    @Query('maNhom') Group_id :string,
    @Query('tenPhim') movie_name_sreach :string,
    @Query('soTrang') page :string = '1',
    @Query('soPhanTuTrenTrang') limit :string = '10',
  ) {
    return this.moviveService.findAllWithPage(movie_name_sreach, Number(page), Number(limit));
  }
  @Get('LayDanhSachPhimTheoNgay')
  findAllWithPageAndDay(
    @Query('maNhom') Group_id :string,
    @Query('tenPhim') title :string = '', 
    @Query('soTrang') page :number = 1,
    @Query('soPhanTuTrenTrang') limit :number = 10,
    @Query('tuNgay') startDate :string = '',
    @Query('denNgay') endDate :string = '',
  ) {
    return this.moviveService.findAllWithPageAndDay({title, page, limit, startDate, endDate});
  }
  @Post('ThemPhimUploadHinh')
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createMoviveDto: CreateMoviveDto
  ) {
    if(!file) throw new Error('Không có file ảnh hoặc trailer để tạo movie')
    const result = await this.cloudinary.uploadImage(file);
    createMoviveDto.image = result.secure_url

    return this.moviveService.create(createMoviveDto);
  }
  @UseGuards(jwtAuthGuard)
  @Post('CapNhatPhimUpload/:id')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 },
  ]))
  async update(
    @Request() req,
    @Query('id', ParseIntPipe) id:number,
    @Body() dto: UpdateMoviveDto,
    @UploadedFile() 
      files: {
      image?: Express.Multer.File[];
      video?: Express.Multer.File[];
    },
  ){
    await this.moviveService.updateMovieVideo(id, dto, files)
  }
  @Get()

  // Xóa movie
  @UseGuards(jwtAuthGuard)
  @Delete('XP/:id')
  deleteMovie(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.moviveService.deleteMovie(+id);
  }
  @UseGuards(jwtAuthGuard)
  @Delete('XoaPhim/:id')
  remove(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.moviveService.deleteMovie(+id);
  }
  // Lấy thông tin chi tiết movie
  @Get('LayThongTinPhim/:id')
  getDetail(@Param('id', ParseIntPipe) id: number) {
    return this.moviveService.getDetail(id);
  }

}
