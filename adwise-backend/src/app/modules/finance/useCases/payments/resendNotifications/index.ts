import { paymentService } from "../../../../../services/paymentService";
import { timeService } from "../../../../../services/timeService";
import { ResendNotificationsUseCase } from "./ResendNotificationsUseCase";

export const resendNotificationsUseCase = new ResendNotificationsUseCase(paymentService);

timeService.add(resendNotificationsUseCase);