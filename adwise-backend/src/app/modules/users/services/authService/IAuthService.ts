import { Result } from "../../../../core/models/Result";
import { IJWTPayload, JsonWebToken } from "../../models/JWT";
export interface IAuthService {
    appSecret: string;
    expires: string;
    sign(payload: IJWTPayload): Promise<Result<JsonWebToken | null, Error | null>>;
    decode(token: JsonWebToken): Promise<Result<IJWTPayload | null, Error | null>>;
}