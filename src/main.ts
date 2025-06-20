import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { jwtAuthGuard } from './module/auth/guards/jwt-auth.guard';
import { ValidationPipe } from '@nestjs/common';
import { httpExceptionFilter } from './common/exceptionFilter/http-exceptionFilter';
import { successResponseInterceptor } from './common/interceptors/successResponse.interceptor';
import { TransformResponseInterceptor } from './common/interceptors/transformResponse.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));
  app.useGlobalFilters(new httpExceptionFilter());
  app.useGlobalInterceptors(new successResponseInterceptor(reflector))
  // app.useGlobalInterceptors(new TransformResponseInterceptor(reflector))
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
