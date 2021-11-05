import { OrganizationNotificationModel } from "../../models/OrganizationNotification";
import { OrganizationNotificationRepo } from "./implementation/OrganizationNotificationRepo";

export const organizationNotificationRepo = new OrganizationNotificationRepo(OrganizationNotificationModel);