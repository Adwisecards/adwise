import { Result } from "../../../../../core/models/Result";

export interface INotificationValidationService {
    sendNotificationServiceData<T>(data: T): Result<string | null, string | null>;
    getOrganizationNotificationsData<T>(data: T): Result<string | null, string | null>;
};