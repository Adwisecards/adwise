import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace CreatePurchaseDTO {
    export interface IPurchaseCoupon {
        couponId: string;
        count: number;
        price?: number;
    };

    export interface Request {
        purchaserContactId: string;
        cashierContactId: string;
        coupons: IPurchaseCoupon[];
        description: string;
        asOrganization?: boolean;
        userId: string;
    };

    export interface ResponseData {
        purchaseId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};