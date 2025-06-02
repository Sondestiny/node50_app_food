import { Module } from '@nestjs/common';
import { BannerService } from './banner.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports :[PrismaModule, CloudinaryModule],
  providers: [BannerService],
  exports: [BannerService]
})
export class BannerModule {}
