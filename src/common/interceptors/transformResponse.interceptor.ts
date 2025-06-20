import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { instanceToPlain, plainToInstance } from "class-transformer";
import { Observable } from "rxjs";
import { DTO_TYPE } from "src/decorator/set-dto-response.decorator";
import {map} from 'rxjs/operators';
import { userResponseDto } from "src/module/auth/dto/User-response.dto";
@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, any>
{
  constructor (
    private readonly reflector: Reflector
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const classType = this.reflector.get(
          DTO_TYPE,
          context.getHandler(),
        );
    return next.handle().pipe(
      map((data) => {
        let transformedData = data;
        // Nếu controller trả về đã là instance DTO thì giữ nguyên
        if (classType) {
          //nếu data là dạng dữ liệu array
          if(Array.isArray(data)) {
            transformedData = data.map((item)=> {
              const transformed = plainToInstance(classType, item, {
                excludeExtraneousValues: true
              })
              return instanceToPlain(transformed);
            })
            return transformedData;
          }

          //Nếu data là dang dữ liệu object với data.item là array
          if (typeof data === "object" && Array.isArray(data.item) ) {
            const transformedDataItem = data.item.map((i) => {
              const transformed = plainToInstance(classType, i, {
                excludeExtraneousValues: true
              })
              return instanceToPlain(transformed)
            })
            transformedData = {...data, item: transformedDataItem}
            return transformedData;
          }

          //Nếu data là dang dữ liệu đơn object
          if (typeof data === "object" ) {
            transformedData = instanceToPlain(
              plainToInstance(classType, data, {
                excludeExtraneousValues: true,
              }))
            return transformedData;
          }
        }
        return data;
      }),
    );
  }
}