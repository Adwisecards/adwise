import { Result } from "../../../../core/models/Result";
import { UseCaseError } from "../../../../core/models/UseCaseError";

export namespace GetPurchasePassDTO {
    export interface Request {
        purchaseId: string;
    };

    export interface ResponseData {
        pass: Buffer;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};