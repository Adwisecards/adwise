import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace CreateWalletDTO {
    export interface Request {
        currency: string;
        userId?: string;
        organizationId?: string;
    };

    export interface ResponseData {
        walletId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};