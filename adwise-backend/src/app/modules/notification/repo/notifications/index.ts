import { NotificationModel } from "../../models/Notification";
import { NotificationRepo } from "./implementation/NotificationRepo";

export const notificationRepo = new NotificationRepo(NotificationModel);