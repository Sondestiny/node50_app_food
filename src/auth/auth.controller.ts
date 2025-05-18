import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProtectGuard } from './guards/protect.guard';
import { AuthService } from './auth.service';
import { jwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from 'src/decorator/isPublic.decorator';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Controller('QuanLyNguoiDung')
export class AuthController {
    constructor(
        private authService: AuthService
    ) {}
    @Public()
    @UseGuards(ProtectGuard)
    @Post('DangNhap')
    async login( @Request() req) {
        return this.authService.login(req.user)
    }
    @Public()
    @Post('DangKy')
    @UsePipes(new ValidationPipe({whitelist: true}))
    async register(@Body() createUserDto: CreateUserDto) {
        return await this.authService.register(createUserDto)
    }

    @Get('LayDanhSachLoaiNguoiDung')
    async getTypeUserList() {
        return await this.authService.getTypeUserList()
    }

    @Get('LayDanhSachNguoiDung')
    async getUserList() {
        return await this.authService.getAllUser()
    }

    @Get('LayDanhSachNguoiDungPhanTrang')
    async getAllUserPaginated(
        @Query('MaNhom') typeUser,
        @Query('tuKhoa') sreach,
        @Query('soTrang') page = 1,
        @Query('soPhanTuTrenTrang') limit = 20,
    ) {
        return await this.authService.getAllUserPaginated(typeUser, sreach, Number(page), Number(limit))
    }

    @Get('TimKiemNguoiDung')
    async sreachUser() {
        return "Tìm kiếm người Dùng"
    }
    
    @Get('TimKiemNguoiDungPhanTrang')
    async sreachUserOfPage() {
        return "Tìm kiếm người Dùng Phân Trang"
    }

    @UseGuards(jwtAuthGuard)
    @Post('ThongTinTaiKhoan')
    getUserAccount(@Request() req) {
        return 'Thông tin tài khoản';
    }

    @Post('LayThongTinNguoiDung')
    getUserProfile(@Request() req) {
        return 'Thông tin người dùng';
    }

    @Post('ThemNguoiDung')
    addUser(@Request() req) {
        return 'Thêm Người Dùng';
    }
    @Put('CapNhatThongTinNguoiDung')
    updateUserByPut(@Request() req) {
        return 'Cập nhật thông tin Người Dùng';
    }
    @Post('CapNhatThongTinNguoiDung')
    updateUserByPost(@Request() req) {
        return 'Cập nhật thông tin Người Dùng';
    }
    @Delete('XoaNguoiDung')
    deleteuser(@Request() req) {
        return 'Xóa Người Dùng';
    }
}
