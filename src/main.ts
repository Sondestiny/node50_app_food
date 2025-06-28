import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, LoggerService } from '@nestjs/common';
import { httpExceptionFilter } from './common/exceptionFilter/http-exceptionFilter';
import { successResponseInterceptor } from './common/interceptors/successResponse.interceptor';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonModule,  } from 'nest-winston';
import { winstonLogger } from './Loggers/logger';
import { Logger} from 'winston';
import { loggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,
    {
      logger: WinstonModule.createLogger({
        instance: winstonLogger
      }),
    }
  )
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER)
  const reflector = app.get(Reflector);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,

  }));
  app.useGlobalFilters(new httpExceptionFilter());
  // 👇 Đăng ký interceptor toàn cục
  app.useGlobalInterceptors(new successResponseInterceptor(reflector))
  app.useGlobalInterceptors(new loggingInterceptor(logger));
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
