import { walletRepo } from "../../../../finance/repo/wallets";
import { organizationRepo } from "../../../repo/organizations";
import { organizationValidationService } from "../../../services/organizations/organizationValidationService";
import { IncreaseOrganizationDepositController } from "./IncreaseOrganizationDepositController";
import { IncreaseOrganizationDepositUseCase } from "./IncreaseOrganizationDepositUseCase";

export const increaseOrganizationDepositUseCase = new IncreaseOrganizationDepositUseCase(
    walletRepo,
    organizationRepo,
    organizationValidationService
);

export const increaseOrganizationDepositController = new IncreaseOrganizationDepositController(increaseOrganizationDepositUseCase);