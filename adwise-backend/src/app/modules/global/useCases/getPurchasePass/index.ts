import { walletService } from "../../../../services/walletService";
import { purchaseRepo } from "../../../finance/repo/purchases";
import { organizationRepo } from "../../../organizations/repo/organizations";
import { GetPurchasePassController } from "./GetPurchasePassController";
import { GetPurchasePassUseCase } from "./GetPurchasePassUseCase";

export const getPurchasePassUseCase = new GetPurchasePassUseCase(purchaseRepo, organizationRepo, walletService);
export const getPurchasePassController = new GetPurchasePassController(getPurchasePassUseCase);