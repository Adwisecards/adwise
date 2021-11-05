import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
// import { IOrganizationNotification } from "../../../models/OrganizationNotification";

export namespace CreateOrganizationNotificationDTO {
    export interface Request {
        organizationId: string;
        purchaseId?: string;
        couponId?: string;
        legalInfoRequestId?: string;
        type: string;
    };

    export interface ResponseData {
        organizationNotificationId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};