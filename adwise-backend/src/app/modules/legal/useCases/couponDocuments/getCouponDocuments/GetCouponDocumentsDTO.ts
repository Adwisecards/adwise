import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ICouponDocument } from "../../../models/CouponDocument";

export namespace GetCouponDocumentsDTO {
    export interface Request {
        couponId: string;
    };

    export interface ResponseData {
        couponDocuments: ICouponDocument[];
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};