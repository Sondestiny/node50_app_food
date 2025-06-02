import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor (
        private authService : AuthService
    ){
        super({ usernameField: 'account' })
    }

    async validate(account:string, password:string): Promise<any> {
        const userValidate = await this.authService.validateUser(Number(account), password);
        if (!userValidate) throw new UnauthorizedException('Thông tin đăng nhập không chính xác')
        return userValidate
    }
}