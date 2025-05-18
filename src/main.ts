import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { jwtAuthGuard } from './auth/guards/jwt-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalGuards(new jwtAuthGuard);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
