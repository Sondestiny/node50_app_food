import { Module } from '@nestjs/common';
import { MoviveService } from './movive.service';
import { MoviveController } from './movive.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { BannerModule } from 'src/banner/banner.module';

@Module({
  imports : [
    PrismaModule, 
    CloudinaryModule,
    BannerModule
  ],
  controllers: [MoviveController],
  providers: [MoviveService],
})
export class MoviveModule {}
