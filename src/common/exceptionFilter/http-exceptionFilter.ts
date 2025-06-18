import { ArgumentsHost, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { response } from "express";

export class httpExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const http = host.switchToHttp();
        const request = http.getRequest();
        const response = http.getResponse();
        // khởi tạo lỗi mặc định
        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let errors = null;
        
        if(exception instanceof HttpException) {
            status = exception.getStatus();
            const res = exception.getResponse();
            if (typeof res === 'string') {
                message = res;
            } else if (typeof res === 'object') {
                const resObj = res as any;
                message = resObj.message || exception.message;
                if (resObj.message && Array.isArray(resObj.message)) {
                    errors = resObj.message;
                    message = 'Validation failed'
                }
            }
        } else if ( exception instanceof Error) {
            message = exception.message;
        }
        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message,
            ...{errors},
            data: null
        })
    }
}