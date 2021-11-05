import { Result } from "../../../../core/models/Result";

export interface IUserNotificationValidationService {
    createUserNotificationData<T>(data: T): Result<string | null, string | null>;
    getUnseenUserNotificationCountData<T>(data: T): Result<string | null, string | null>;
    getUserNotificationsData<T>(data: T): Result<string | null, string | null>;
};