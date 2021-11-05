import { Result } from "../../../../../core/models/Result";

export interface INotificationSettingsValidationService {
    updateNotificationSettingsData<T>(data: T): Result<string | null, string | null>;
};