import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ICoupon } from "../../../models/Coupon";

export interface ICategoryCoupons {
    category: string;
    categoryCoupons: ICoupon[];
};

export namespace GetCategoryCouponsDTO {
    export interface Request {
        contactId: string;
    };

    export interface ResponseData {
        categoryCoupons: ICategoryCoupons[];
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};