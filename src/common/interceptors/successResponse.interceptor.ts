import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { RESPONSE_MESSAGE_KEY } from "src/decorator/response-message.decorator";
export class successResponseInterceptor<T> implements NestInterceptor<T, any> {
    constructor (private readonly reflector : Reflector) {}
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        const handlerMessage = this.reflector.get<string>(
            RESPONSE_MESSAGE_KEY,
            context.getHandler()
        );
        const classMessage = this.reflector.get<string>(
            RESPONSE_MESSAGE_KEY,
            context.getClass()
        );

        return next.handle().pipe(
            map((originalData)=> {
                // Trường hợp service trả về object có key message + data
                const hasCustom = originalData && typeof originalData === 'object';
                const serviceMessage = hasCustom ? originalData.message : undefined;
                const serviceData = hasCustom && 'data' in originalData ? originalData.data : originalData;
                return {
                    statusCode: context.switchToHttp().getResponse().statusCode || 200,
                    message: serviceMessage || handlerMessage || classMessage || 'Success',
                    data: serviceData,
                };
            }) 
        )
    }
}