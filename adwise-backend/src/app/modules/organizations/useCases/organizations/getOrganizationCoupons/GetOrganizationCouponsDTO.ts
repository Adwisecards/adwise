import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ICoupon } from "../../../models/Coupon";

export namespace GetOrganizationCouponsDTO {
    export interface Request {
        limit: number;
        page: number;
        organizationId: string;
        all: boolean;
        type: string;
        disabled: boolean;
        export: boolean;
    };

    export interface ResponseData {
        coupons: any[];
        count: number;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};