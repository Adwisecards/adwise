import { notificationRepo } from "../../../../notification/repo/notifications";
import { administrationValidationService } from "../../../services/administrationValidationService";
import { FindAllNotificationsController } from "./FindAllNotificationsController";
import { FindAllNotificationsUseCase } from "./FindAllNotificationsUseCase";

export const findAllNotificationsUseCase = new FindAllNotificationsUseCase(notificationRepo, administrationValidationService);
export const findAllNotificationsController = new FindAllNotificationsController(findAllNotificationsUseCase);