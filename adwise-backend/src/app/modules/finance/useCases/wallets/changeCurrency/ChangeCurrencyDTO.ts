import { Result } from "../../../../../core/models/Result"
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace ChangeCurrencyDTO {
    export interface Request {
        userId: string;
        currency: string;
    };

    export interface ResponseData {
        userWalletId: string;
        organizationWalletId?: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};