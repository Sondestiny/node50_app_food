import { Injectable } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBannerDto } from './dto/create-banner.dto';

@Injectable()
export class BannerService {
    constructor (
        private prima: PrismaService,
        private cloudinary: CloudinaryService
    ) {}
    async getAll(){
        return await this.prima.banners.findMany({})
    }
    async create(dto: CreateBannerDto){
        return await this.prima.banners.create({
            data: dto
        })
    }
}
