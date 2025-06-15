import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './module/auth/auth.module';
import { UserModule } from './module/user/user.module';
import { BookingsModule } from './module/bookings/bookings.module';
import { MoviveModule } from './module/movive/movive.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { BannerModule } from './module/banner/banner.module';
import { TheaterModule } from './module/theater/theater.module';
import { ShowtimesModule } from './module/showtimes/showtimes.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule, 
    AuthModule, 
    UserModule, 
    BookingsModule, 
    MoviveModule, 
    CloudinaryModule, 
    BannerModule, 
    TheaterModule, 
    ShowtimesModule
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    PrismaService
  ],
})
export class AppModule {}
