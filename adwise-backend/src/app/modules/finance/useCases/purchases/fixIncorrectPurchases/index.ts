import { globalRepo } from "../../../../administration/repo/globals";
import { organizationStatisticsService } from "../../../../organizations/services/organizations/organizationStatisticsService";
import { paymentRepo } from "../../../repo/payments";
import { purchaseRepo } from "../../../repo/purchases";
import { transactionRepo } from "../../../repo/transactions";
import { calculatePurchaseMarketingUseCase } from "../calculatePurchaseMarketing";
import { confirmPurchaseUseCase } from "../confirmPurchase";
import { FixIncorrectPurchasesUseCase } from "./FixIncorrectPurchasesUseCase";

export const fixIncorrectPurchasesUseCase = new FixIncorrectPurchasesUseCase(
    globalRepo,
    paymentRepo,
    purchaseRepo,
    transactionRepo,
    confirmPurchaseUseCase,
    organizationStatisticsService,
    calculatePurchaseMarketingUseCase
);