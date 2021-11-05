import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace SetCouponCategoryDisabledDTO {
    export interface Request {
        userId: string;
        couponCategoryId: string;
        disabled: boolean;
    };

    export interface ResponseData {
        couponCategoryId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};