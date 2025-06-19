import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { instanceToPlain, plainToInstance } from "class-transformer";
import { Observable } from "rxjs";
import { DTO_TYPE } from "src/decorator/use-dto.decorator";
import {map} from 'rxjs/operators';
import { userResponseDto } from "src/module/auth/dto/User-response.dto";
@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, any>
{
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // Nếu controller trả về đã là instance DTO thì giữ nguyên
        // const classType = Reflect.getMetadata(
        //     DTO_TYPE,
        //     context.getHandler(),
        //     );
        const classType = userResponseDto;
        console.log(classType)
        console.log(data)
        if (classType) {
          // nếu data là dạng dữ liệu array
          // if(Array.isArray(data)) {
          //   for(const item of data) {
          //     if (classType) {
          //       const transformed = plainToInstance(classType, data, {
          //         excludeExtraneousValues: true,
          //       });

          //       return instanceToPlain(transformed); // trả về plain object đã ẩn field
          //     }
          //   }
          // }
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