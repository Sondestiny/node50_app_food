import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { jwtAuthGuard } from './module/auth/guards/jwt-auth.guard';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
