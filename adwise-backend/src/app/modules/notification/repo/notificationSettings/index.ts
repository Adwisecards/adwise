import { NotificationSettingsModel } from '../../models/NotificationSettings';
import { NotificationSettingsRepo } from './implementation/NotificationSettingsRepo';

export const notificationSettingsRepo = new NotificationSettingsRepo(NotificationSettingsModel);