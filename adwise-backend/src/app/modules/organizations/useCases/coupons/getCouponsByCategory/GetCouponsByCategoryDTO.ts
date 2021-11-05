import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ICoupon } from "../../../models/Coupon";

export namespace GetCouponsByCategoryDTO {
    export interface Request {
        category: string;
        contactId: string;
    };

    export interface ResponseData {
        coupons: ICoupon[];
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};