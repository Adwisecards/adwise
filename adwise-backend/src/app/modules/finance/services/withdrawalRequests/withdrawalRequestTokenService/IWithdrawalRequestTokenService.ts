import { Result } from "../../../../../core/models/Result";

export interface IWithdrawalRequestTokenPayload {
    userId: string;
};

export interface IWithdrawalRequestTokenService {
    sign(payload: IWithdrawalRequestTokenPayload): Promise<Result<string | null, Error | null>>;
    decode(token: string): Promise<Result<IWithdrawalRequestTokenPayload | null, Error | null>>;
};