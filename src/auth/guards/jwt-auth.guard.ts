import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { IS_PUBLIC_KEY } from "src/decorator/isPublic.decorator";
@Injectable()
export class jwtAuthGuard extends AuthGuard ('jwt') {
    constructor (
        private reflector: Reflector
    ) {
        super(0)
    }

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean> (IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ])
        if (isPublic) {
        return true;
        }
        return super.canActivate(context);
    }


} 