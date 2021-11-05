import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace CreatePurchaseAsUserDTO {
    export interface Request {
        userId: string;
        purchaseId: string;
        purchaserContactId: string;
    };

    export interface ResponseData {
        purchaseId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};