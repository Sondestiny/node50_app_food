import { Module } from '@nestjs/common';
import { ShowtimesService } from './showtimes.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ShowtimesService],
  exports: [ShowtimesService]
})
export class ShowtimesModule {}
