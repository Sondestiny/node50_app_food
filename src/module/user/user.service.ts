import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor( private prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    return await this.prisma.users.create({
      data: createUserDto
    })
  }

  async findOne(email: string): Promise<any> {
    return await this.prisma.users.findFirst({
      where: {email}
    });
  }
}
