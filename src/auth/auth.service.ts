import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { User } from 'src/user/entities/user.entity';
import { promises } from 'node:dns';
@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private prisma: PrismaClient,
    ) {}
    async validateUser(email:string, password:string):Promise<any> {
        const user = await this.userService.findOne(email)
        if (user && user.password === password) {
        const { password, ...result } = user;
        return result;
        }
        return null
    }
    async login (user:any):Promise<any> {
        const payload = {user_id: user.user_id, email: user.email}
        return {
            access_token: await this.jwtService.signAsync(payload)
        }
    }

    async register(createUserDto: CreateUserDto):Promise<any> {
        
        const userExist = await this.userService.findOne(createUserDto?.email);
        if (userExist) throw new UnauthorizedException('Người dùng đã tồn tại')
        const {PASSWORD, ...data} = createUserDto;
        const hashedPassword = await bcrypt.hash(PASSWORD, 10)

        const newUser = await this.userService.create({
                ...data,
                PASSWORD: hashedPassword,
                },
        )
        return newUser
    }
    async getTypeUserList() {
        const listTypeUser = await this.prisma.users.findMany({
            distinct: 'TypeUser',
            select: {'TypeUser': true}
        })
        return listTypeUser
    }

    async getAllUser() : Promise<User[]> {
        return this.prisma.users.findMany({
            select: {
            fullname: true,
            email: true,
            created_at: true,
            // loại bỏ password vì không nên trả về
            },
    });}

    async getAllUserPaginated(page = 1, limit = 10, sreach, typeUser){
        const skip = (page - 1) * limit;
        const where = sreach ? {
            typeUser: typeUser,
            fullname: {contains: sreach, mode: 'insensitive'}
        } : {}

        const [data, total] = await Promise.all([
            this.prisma.users.findMany({
                        skip,
                        take: limit,
                        where: where,
                        select: {
                            fullname: true,
                            email: true,
                            created_at: true,
                        },
            }),
            this.prisma.users.count()
        ])
        return {data, total, page, lastPage: Math.ceil(total / limit)}
}}
