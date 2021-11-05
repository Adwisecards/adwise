import { IAuthService } from "../IAuthService";
import jwt from "jsonwebtoken";
import { Result } from "../../../../../core/models/Result";
import { IJWTPayload, JsonWebToken } from "../../../models/JWT";

export class AuthService implements IAuthService {
    public appSecret: string;
    public expires: string;
    constructor(appSecret: string, expires: string) {
        this.appSecret = appSecret;
        this.expires = expires;
    }

    sign(payload: IJWTPayload): Promise<Result<JsonWebToken | null, Error | null>> {
        return new Promise(resolve => {
            jwt.sign(payload, this.appSecret, {
                expiresIn: this.expires
            }, (err, encoded: any) => {
                if (err) return resolve(Result.fail(err));
                return resolve(Result.ok(encoded));
            });
        });
    }

    decode(token: JsonWebToken): Promise<Result<IJWTPayload | null, Error | null>> {
        return new Promise(resolve => {
            jwt.verify(token, this.appSecret, (err: any, decoded: any) => {
                if (err) return resolve(Result.fail(err));
                return resolve(Result.ok(decoded as IJWTPayload));
            });
        });
    }
}