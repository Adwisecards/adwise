import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace CreateCouponDTO {
    export interface Request {
        userId: string;
        organizationId: string;
        quantity: number;
        offerType: string;
        offerPercent: number;
        offerPoints: number;
        name: string;
        description: string;
        distributionSchema: {
            first: number;
            other: number;
        };
        startDate: string;
        endDate: string;
        documentMediaId: string;
        termsDocumentMediaId: string;
        price: number;
        locationAddressId: string;
        index: number;
        type: string;
        pictureMediaId: string;
        couponCategoryIds: string[];
        ageRestricted?: string;
        floating?: boolean;
        disabled?: boolean;
    };

    export interface ResponseData {
        couponId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};