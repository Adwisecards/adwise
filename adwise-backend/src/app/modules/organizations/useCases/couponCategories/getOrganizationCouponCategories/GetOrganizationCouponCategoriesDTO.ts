import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ICouponCategory } from "../../../models/CouponCategory";

export namespace GetOrganizationCouponCategoriesDTO {
    export interface Request {
        organizationId: string;
        disabled?: boolean;
    };

    export interface ResponseData {
        couponCategories: ICouponCategory[];
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};