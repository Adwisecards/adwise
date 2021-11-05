import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { INotificationSettings } from "../../../models/NotificationSettings";

export namespace GetNotificationSettingsDTO {
    export interface Request {
        userId: string;
    };

    export interface ResponseData {
        notificationSettings: INotificationSettings;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};