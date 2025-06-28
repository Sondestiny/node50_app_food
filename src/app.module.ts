import { Logger, Module } from '@nestjs/common';
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
import { winstonLogger } from './Loggers/logger';
import { WinstonModule } from 'nest-winston';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WinstonModule.forRoot({
      instance: winstonLogger
    }),
    CacheModule.register({
      isGlobal: true, // cho phép sử dụng trên toàn bộ ứng dụng
      ttl: 10, // thời gian lưu cache (10 giây)
      max: 100, // SỐ lượng item tối đa trong cache
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
    PrismaService,
    Logger
    
  ],
})
export class AppModule {}
