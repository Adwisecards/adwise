import { Result } from "../../../../../../core/models/Result";
import { IWithdrawalRequestTokenPayload, IWithdrawalRequestTokenService } from "../IWithdrawalRequestTokenService";
import jwt from 'jsonwebtoken';

export class WithdrawalRequestTokenService implements IWithdrawalRequestTokenService {
    private appSecret: string;
    private expires: string;
    constructor(appSecret: string, expires: string) {
        this.appSecret = appSecret;
        this.expires = expires;
    }

    public sign(payload: IWithdrawalRequestTokenPayload): Promise<Result<string | null, Error | null>> {
        return new Promise<any>(resolve => {
            jwt.sign(payload, this.appSecret, {
                expiresIn: this.expires
            }, (err, token) => {
                if (err) {
                    return resolve(Result.fail(err));
                }

                return resolve(Result.ok(token));
            });
        });
    }

    public decode(token: string): Promise<Result<IWithdrawalRequestTokenPayload | null, Error | null>> {
        return new Promise<any>(resolve => {
            jwt.verify(token, this.appSecret, (err, payload) => {
                if (err) {
                    return resolve(Result.fail(err));
                }

                return resolve(Result.ok(payload));
            });
        });
    }
}