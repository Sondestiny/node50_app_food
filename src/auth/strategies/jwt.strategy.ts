import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "../auth.service";
import { constants } from "src/common/constants/constant";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor (
        private authService : AuthService
    ){
         super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: constants.secret,
            });
    }

    async validate(payload: any) {
    return { user_id: payload.user_id, email: payload.email };
  }
}