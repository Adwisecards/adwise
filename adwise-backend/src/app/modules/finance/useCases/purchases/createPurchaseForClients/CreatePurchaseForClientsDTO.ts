import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { CreatePurchaseDTO } from "../createPurchase/CreatePurchaseDTO";

export namespace CreatePurchaseForClientsDTO {
    export interface Request {
        purchaserContactIds: string[];
        cashierContactId: string;
        coupons: CreatePurchaseDTO.IPurchaseCoupon[];
        description: string;
        userId: string;
    };

    export interface ResponseData {
        purchaseIds: string[];
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};