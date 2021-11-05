import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { INotification } from "../../../models/Notification";

export namespace GetOrganizationNotificationsDTO {
    export interface Request {
        organizationId: string;
        userId: string;
        search: string;
        limit: number;
        page: number;
    };

    export interface ResponseData {
        notifications: INotification[];
        count: number;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};