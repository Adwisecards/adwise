import { name } from "faker"
import { Result } from "../../../../../core/models/Result"
import { UseCaseError } from "../../../../../core/models/UseCaseError"
import { IOrganizationNotification } from "../../../models/OrganizationNotification";

export namespace GetOrganizationNotificationsDTO {
    export interface Request {
        organizationId: string;
        userId: string;
        seen: boolean;
        limit: number;
        page: number;
    };

    export interface ResponseData {
        organizationNotifications: IOrganizationNotification[];
        count: number;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};