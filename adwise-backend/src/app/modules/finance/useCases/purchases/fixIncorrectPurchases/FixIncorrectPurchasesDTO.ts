import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace FixIncorrectPurchasesDTO {
    export interface Request {
        purchaseIds: string[];
    };

    export interface ResponseData {
        purchaseIds: string[];
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};