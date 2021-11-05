import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace SetCouponCategoriesDTO {
    export interface Request {
        couponId: string;
        couponCategoryIds: string[];
        userId: string;
    };

    export interface ResponseData {
        couponId: string;
    };
    
    export type Response = Result<ResponseData | null, UseCaseError | null>;
};