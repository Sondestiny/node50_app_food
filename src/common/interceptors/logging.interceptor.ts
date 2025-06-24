import { 
    CallHandler, 
    ExecutionContext, 
    Inject, 
    Injectable, 
    Logger, 
    LoggerService, 
    NestInterceptor 
} from "@nestjs/common"
import {
    Observable, 
    tap
} from "rxjs"

@Injectable()
export class loggingInterceptor implements NestInterceptor{
    
    constructor(@Inject('winston') private readonly logger: LoggerService) {}

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any>{
        const now = Date.now();
        const req = context.switchToHttp().getRequest();
        const {method, originalUrl, body, query, user} = req;

        this.logger.log(`[Request] ${method} ${originalUrl}`);
        
        return next.handle().pipe(
            tap(()=> {
                const duration = Date.now() - now;
                this.logger.log(`[Response] ${method} ${originalUrl} | ${duration}ms`)
            })
        )
    }
}