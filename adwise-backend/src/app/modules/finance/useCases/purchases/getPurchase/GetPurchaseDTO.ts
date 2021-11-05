import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IPurchase } from "../../../models/Purchase";

export namespace GetPurchaseDTO {
    export interface Request {
        purchaseId: string;
        multiple?: boolean;
        userId: string;
    };

    export interface ResponseData {
        purchase: IPurchase;
        cashAvailable: boolean;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};