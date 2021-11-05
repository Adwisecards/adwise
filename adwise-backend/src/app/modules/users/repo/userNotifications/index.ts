import { UserNotificationModel } from "../../models/UserNotification";
import { UserNotificationRepo } from "./implementation/UserNotificationRepo";

export const userNotificationRepo = new UserNotificationRepo(UserNotificationModel);