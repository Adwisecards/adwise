import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace GetUnseenOrganizationNotificationCountDTO {
    export interface Request {
        organizationId: string;
        userId: string;
    };

    export interface ResponseData {
        count: number;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};