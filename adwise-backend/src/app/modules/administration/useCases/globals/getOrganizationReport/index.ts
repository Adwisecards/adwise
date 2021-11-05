import { xlsxService } from "../../../../../services/xlsxService";
import { zipService } from "../../../../../services/zipService";
import { accumulationRepo } from "../../../../finance/repo/accumulations";
import { paymentRepo } from "../../../../finance/repo/payments";
import { purchaseRepo } from "../../../../finance/repo/purchases";
import { transactionRepo } from "../../../../finance/repo/transactions";
import { walletRepo } from "../../../../finance/repo/wallets";
import { organizationRepo } from "../../../../organizations/repo/organizations";
import { GetOrganizationReportController } from "./GetOrganizationReportController";
import { GetOrganizationReportUseCase } from "./GetOrganizationReportUseCase";

export const getOrganizationReportUseCase = new GetOrganizationReportUseCase(
    zipService, 
    walletRepo, 
    xlsxService,
    paymentRepo,
    purchaseRepo,
    transactionRepo, 
    accumulationRepo,
    organizationRepo
);
export const getOrganizationReportController = new GetOrganizationReportController(getOrganizationReportUseCase);