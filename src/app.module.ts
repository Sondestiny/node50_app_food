import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookingsModule } from './bookings/bookings.module';
import { MoviveModule } from './movive/movive.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { BannerModule } from './banner/banner.module';
import { TheaterModule } from './theater/theater.module';

@Module({
  imports: [PrismaModule, AuthModule, UserModule, BookingsModule, MoviveModule, CloudinaryModule, BannerModule, TheaterModule],
  controllers: [AppController],
  providers: [
    AppService, 
    PrismaService
  ],
})
export class AppModule {}
