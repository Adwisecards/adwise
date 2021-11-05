import { paymentService } from "../../../../../services/paymentService";
import { timeService } from "../../../../../services/timeService";
import { globalRepo } from "../../../../administration/repo/globals";
import { organizationRepo } from "../../../../organizations/repo/organizations";
import { userRepo } from "../../../../users/repo/users";
import { accumulationRepo } from "../../../repo/accumulations";
import { paymentRepo } from "../../../repo/payments";
import { purchaseRepo } from "../../../repo/purchases";
import { walletRepo } from "../../../repo/wallets";
import { calculatePurchaseMarketingUseCase } from "../../purchases/calculatePurchaseMarketing";
import { createTransactionUseCase } from "../../transactions/createTransaction";
import { PayAccumulatedPaymentsUseCase } from "./PayAccumulatedPaymentsUseCase";

export const payAccumulatedPaymentsUseCase = new PayAccumulatedPaymentsUseCase(
    userRepo,
    globalRepo,
    walletRepo,
    paymentRepo,
    purchaseRepo,
    paymentService,
    accumulationRepo,
    organizationRepo,
    createTransactionUseCase,
    calculatePurchaseMarketingUseCase
);

timeService.add(payAccumulatedPaymentsUseCase);