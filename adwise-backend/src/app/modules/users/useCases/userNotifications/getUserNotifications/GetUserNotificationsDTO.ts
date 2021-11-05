import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IUserNotification } from "../../../models/UserNotification";

export namespace GetUserNotificationsDTO {
    export interface Request {
        userId: string;
        seen: boolean;
        limit: number;
        page: number;
    };

    export interface ResponseData {
        userNotifications: IUserNotification[];
        count: number;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};