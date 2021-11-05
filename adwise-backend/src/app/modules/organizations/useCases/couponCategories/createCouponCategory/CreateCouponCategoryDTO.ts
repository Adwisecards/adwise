import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace CreateCouponCategoryDTO {
    export interface Request {
        name: string;
        organizationId: string;
        userId: string;
    };

    export interface ResponseData {
        couponCategoryId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};