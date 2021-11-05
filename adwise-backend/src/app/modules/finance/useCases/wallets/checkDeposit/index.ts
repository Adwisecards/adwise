import { timeService } from "../../../../../services/timeService";
import { createOrganizationNotificationUseCase } from "../../../../organizations/useCases/organizationNotifications/createOrganizationNotification";
import { walletRepo } from "../../../repo/wallets";
import { CheckDepositUseCase } from "./CheckDepositUseCase";

export const checkDepositUseCase = new CheckDepositUseCase(
    walletRepo,
    createOrganizationNotificationUseCase
);

timeService.add(checkDepositUseCase);