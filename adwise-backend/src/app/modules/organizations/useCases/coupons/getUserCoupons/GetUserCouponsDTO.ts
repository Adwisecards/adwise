import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ICoupon } from "../../../models/Coupon";

export namespace GetUserCouponsDTO {
    export type SortBy = 'quantity' | 'disabled' | 'endDate' | 'price' | 'cashback';

    export interface Request {
        userId: string;
        sortBy: SortBy;
        order: number;
    };

    export interface ResponseData {
        coupons: ICoupon[];
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};