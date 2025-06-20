import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/module/user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from 'src/module/user/entities/user.entity';
import { UpdateUserDto } from 'src/module/user/dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { registerDto } from './dto/register.dto';
@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private prisma: PrismaService,
    ) {}
    async validateUser(account:number, password:string):Promise<any> {
        const user = await this.prisma.users.findUnique({
            where: {account: account},
            select: {
                PASSWORD: true,
                email: true,
                is_deleted: true
            }
        })
        if(!user) throw new BadRequestException('Không tìm thấy người dùng')
        if(user.is_deleted == true) throw new NotFoundException('Người dùng đã bị xóa khỏi hệ thống')
        const CorrectPassword = await bcrypt.compare(password, user.PASSWORD)
        if (!CorrectPassword) throw new UnauthorizedException('Thông tin đăng nhập không chính xác')
        // Lọc field PASSWORD để trả kết quả về
        return {account, email:user.email}
    }
    async login (account:string):Promise<any> {
        const payload = {account}
        return {
            access_token: await this.jwtService.signAsync(payload)
        }
    }

    async register(dto: registerDto):Promise<any> {
        
        const userExist = await this.prisma.users.findFirst({
            where: {
                account: dto.account
            }
        });
        if (userExist) throw new UnauthorizedException('Người dùng đã tồn tại')
        const {PASSWORD, ...dataUser} = dto;
        const hashedPassword = await bcrypt.hash(PASSWORD, 10)
        const newUser = await this.prisma.users.create({
            data: {
                ...dataUser,
                PASSWORD: hashedPassword,
            },
        })
        return newUser
    }
    async getTypeUserList() {
        const listTypeUser = await this.prisma.users.findMany({
            distinct: 'TypeUser',
            select: {'TypeUser': true}
        })
        if (!listTypeUser) throw new BadRequestException('Không tìm thấy loại người dùng');
        const result :Array<string> = [];
        for(const typeUser of listTypeUser) {
            result.push(typeUser.TypeUser ? typeUser.TypeUser : '')
        }
        
        return result;
    }

    async getUserList(
        group:string, 
        sreach:string
    ) : Promise<User[]> {
        return this.prisma.users.findMany({
            where: {
                fullname: {
                    contains: sreach,
                }, 
                }
    })}

    async getUserListPaginated( 
        group:string, 
        sreach: string , 
        page: number, 
        limit: number 
    ): Promise<any>{
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.users.findMany({
                        skip,
                        take: limit,
                        where: {fullname: {contains: sreach}},
            }),
            this.prisma.users.count()
        ])
        const result = {
            item: data, 
            total, 
            page, 
            lastPage: Math.ceil(total / limit)
        }
        return result
    }
    async sreachUser(typeUser, sreach): Promise<User> {
        const user = await this.prisma.users.findFirst({
            where: {fullname: {contains: sreach}}
        })
        if(!user) throw new Error('Không tìm thấy người dùng')
        return user
    }
    async sreachUserOfPage(typeUser, sreach, page, limit) {
        const skip = (page - 1) * limit;
        const where = sreach ? {
            fullname: {contains: sreach}
        } : {}

        const [data, total] = await Promise.all([
            this.prisma.users.findMany({
                        skip,
                        take: limit,
                        where: where,
            }),
            this.prisma.users.count({where: where})
        ])
        const result = {
            item:data, 
            total, 
            page, 
            lastPage: Math.ceil(total / limit)
        }
        return result
    }
    async getUserAccount(account:number) {
        return this.prisma.users.findUnique({
            where: {account},
        });
    }
    async getUserInfo (account) {
        const userInfo = await this.prisma.users.findUnique({
            where: {account},
            select: {
            account: true,
            fullname: true,
            email: true,
            phone: true,
            TypeUser: true
            }
        })
        if (!userInfo) throw new UnauthorizedException('Không tìm thấy thông tin người dùng')
        return userInfo
    }
    async createUser (createUserDto: CreateUserDto) {
        const {
            account, 
            PASSWORD,
            email, 
            phone,
            fullname,
            TypeUser,
             } = createUserDto
        const existingUser = await this.prisma.users.findFirst({ where: { email } });
        if (existingUser) {
            throw new Error('Email already in use');
        }
        const hashedPassword = await bcrypt.hash(PASSWORD, 10);
        const user = await this.prisma.users.create({
            data: {
            account, 
            PASSWORD: hashedPassword,
            email, 
            phone,
            fullname,
            TypeUser
            }
        });
        return user;
    }
    async updatedUser (updateUserDto: UpdateUserDto, account:number) {
        const { email, PASSWORD, ...rest } = updateUserDto;
        // Kiểm tra email có tồn tại
        const existing = await this.prisma.users.findUnique({ where: { account } });
        if (!existing) {throw new Error('Không tìm thấy người dùng')}

          // Hash password nếu có cập nhật
        const updateData: any = { ...rest };
        
        const updatedUser = await this.prisma.users.update({
            where: { account},
            data: updateData,
            select: {
            account: true,
            fullname: true,
            email: true,
            updated_at: true,
            },
        });
    }
    async deleteUser(account:number) {
        const existingUser = await this.prisma.users.findFirst({
            where: {
                account
            },
            select: {
                is_deleted: true
            }
        })
        if(!existingUser) throw new NotFoundException('Không tìm thấy tài khoản')
        if(existingUser.is_deleted == true) throw new NotFoundException('Tài khoản đã bị xóa')

        return this.prisma.users.update({
            where: { account },
            data: {
                is_deleted: true,
                updated_at: new Date(), // ✅ soft delete
                
            },
            select: {
            fullname: true,
            account: true,
            updated_at: true,
            },
        });
    
    }

}

