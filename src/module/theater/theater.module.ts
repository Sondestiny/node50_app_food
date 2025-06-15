import { Module } from '@nestjs/common';
import { TheaterService } from './theater.service';
import { TheaterController } from './theater.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ShowtimesModule } from 'src/module/showtimes/showtimes.module';

@Module({
  imports: [PrismaModule, ShowtimesModule],
  controllers: [TheaterController],
  providers: [TheaterService],
})
export class TheaterModule {}
