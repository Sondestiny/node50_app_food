import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req, Request, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProtectGuard } from './guards/protect.guard';
import { AuthService } from './auth.service';
import { jwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from 'src/decorator/isPublic.decorator';
import { CreateUserDto } from 'src/module/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/module/user/dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { registerDto } from './dto/register.dto';
import { group } from 'console';
import { TransformResponseInterceptor } from 'src/common/interceptors/transformResponse.interceptor';
import { setDtoResponse } from 'src/decorator/set-dto-response.decorator';
import { userResponseDto } from './dto/User-response.dto';

@UseGuards(jwtAuthGuard)
@UseInterceptors(TransformResponseInterceptor)
@Controller('QuanLyNguoiDung')
export class AuthController {
    constructor(
        private authService: AuthService
    ) {}
    @Public()
    @UseGuards(ProtectGuard)
    @Post('DangNhap')
    async login(
        @Request() req,
        @Body() dto: LoginDto
    ) {
        return this.authService.login(dto.account)
    }
    @Public()
    @Post('DangKy')
    async register(@Body() dto: registerDto) {
        return await this.authService.register(dto)
    }
    @Public()
    @Get('LayDanhSachLoaiNguoiDung')
    async getTypeUserList() {
        return await this.authService.getTypeUserList()
    }
    @Public()
    @setDtoResponse(userResponseDto)
    @Get('LayDanhSachNguoiDung')
    async getUserList(
        @Query('MaNhom') group: string = 'GP01',
        @Query('tuKhoa') sreach: string = '',
    ) {
        return await this.authService.getUserList(group, sreach)
    }
    @Public()
    @setDtoResponse(userResponseDto)
    @Get('LayDanhSachNguoiDungPhanTrang')
    async getUserListPaginated(
        @Query('MaNhom') group: string = 'GP01',
        @Query('tuKhoa') sreach: string = '',
        @Query('soTrang') page:string = '1',
        @Query('soPhanTuTrenTrang') limit:string = '20',
    ) {
        return await this.authService.getUserListPaginated(group, sreach, Number(page), Number(limit))
    }
    @Public()
    @setDtoResponse(userResponseDto)
    @Get('TimKiemNguoiDung')
    async sreachUser(
        @Query('MaNhom') group:string = 'GP01',
        @Query('tuKhoa') sreach: string = '',
    ) {
        return await this.authService.sreachUser(group, sreach)
    }
    @Public()
    @setDtoResponse(userResponseDto)
    @Get('TimKiemNguoiDungPhanTrang')
    async sreachUserOfPage(
        @Query('MaNhom') group:string = 'GP01',
        @Query('tuKhoa') sreach: string = '',
        @Query('soTrang') page:string = '1',
        @Query('soPhanTuTrenTrang') limit:string = '1',
    ) {
        return this.authService.sreachUserOfPage(group, sreach, Number(page), Number(limit))
    }
    @setDtoResponse(userResponseDto)
    @Post('ThongTinTaiKhoan')
    getUserAccount(@Request() req) {
        const account = req.user.account
        return this.authService.getUserAccount(+account);
    }
    @setDtoResponse(userResponseDto)
    @Post('LayThongTinNguoiDung')
    getUserProfile(
        @Query('taiKhoan') account: string = '',
        @Request() req) 
        {
        return this.authService.getUserInfo(account);
    }
    @setDtoResponse(userResponseDto)
    @Post('ThemNguoiDung')
    createUser(
        @Body() createUserDto : CreateUserDto
    ) {
        return this.authService.createUser(createUserDto);
    }
    @setDtoResponse(userResponseDto)
    @Put('CapNhatThongTinNguoiDung')
    updateUserByPut(
        @Request() req,
        @Body() updateUserDto : UpdateUserDto
    ) {
        const account= req.user.account
        return this.authService.updatedUser(updateUserDto, Number(account));
    }
    @setDtoResponse(userResponseDto)
    @Post('CapNhatThongTinNguoiDung')
    updateUserByPost(
        @Request() req,
        @Body() updateUserDto : UpdateUserDto
    ) {
        const account= req.user.account
        return this.authService.updatedUser(updateUserDto, Number(account));
    }

    @Delete('XoaNguoiDung')
    deleteuser(
        @Request() req,
        @Query('taiKhoan') account: string 
    ) {
        return this.authService.deleteUser(Number(account))
    }
}
