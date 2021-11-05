import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ICoupon } from "../../../../organizations/models/Coupon";

export namespace FindAllCouponsDTO {
    export interface Request {
        [key: string]: string | number;
        sortBy: string;
        order: number;
        pageSize: number;
        pageNumber: number;
    };

    export interface ResponseData {
        coupons: ICoupon[];
        count: number;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};