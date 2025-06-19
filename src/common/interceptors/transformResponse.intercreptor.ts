import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { instanceToPlain, plainToInstance } from "class-transformer";
import { Observable } from "rxjs";
import { DTOTYPE } from "src/decorator/use-dto.decorator";
@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, any>
{
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // Nếu controller trả về đã là instance DTO thì giữ nguyên
        const classType = Reflect.getMetadata(
          DTOTYPE,
          context.getHandler(),
        );

        if (classType) {
          const transformed = plainToInstance(classType, data, {
            excludeExtraneousValues: true,
          });

          return instanceToPlain(transformed); // trả về plain object đã ẩn field
        }

        return data;
      }),
    );
  }
}