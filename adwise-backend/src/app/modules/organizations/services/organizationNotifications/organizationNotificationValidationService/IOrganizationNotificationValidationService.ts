import { Result } from "../../../../../core/models/Result";

export interface IOrganizationNotificationValidationService {
    getOrganizationNotificationsData<T>(data: T): Result<string | null, string | null>;
    createOrganizationNotificationData<T>(data: T): Result<string | null, string | null>;
    getUnseenOrganizationNotificationCountData<T>(data: T): Result<string | null, string | null>;
};