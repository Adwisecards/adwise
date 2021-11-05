import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace UpdateNotificationSettingsDTO {
    export interface Request {
        userId: string;
        restrictedOrganizations: string[];
        coupon: boolean;
        contact: boolean;
        ref: boolean;
    };

    export interface ResponseData {
        notificationSettingsId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};