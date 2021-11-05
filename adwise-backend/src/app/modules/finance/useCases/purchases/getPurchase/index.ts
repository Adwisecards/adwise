import { globalRepo } from "../../../../administration/repo/globals";
import { contactRepo } from "../../../../contacts/repo/contacts";
import { organizationRepo } from "../../../../organizations/repo/organizations";
import { userRepo } from "../../../../users/repo/users";
import { purchaseRepo } from "../../../repo/purchases";
import { walletRepo } from "../../../repo/wallets";
import { purchaseValidationService } from "../../../services/purchases/purchaseValidationService";
import { calculatePurchaseMarketingUseCase } from "../calculatePurchaseMarketing";
import { GetPurchaseController } from "./GetPurchaseController";
import { GetPurchaseUseCase } from "./GetPurchaseUseCase";

const getPurchaseUseCase = new GetPurchaseUseCase(
    purchaseRepo, 
    organizationRepo, 
    walletRepo, 
    globalRepo, 
    calculatePurchaseMarketingUseCase,
    userRepo,
    purchaseValidationService,
    contactRepo
);

const getPurchaseController = new GetPurchaseController(getPurchaseUseCase);

export {
    getPurchaseUseCase,
    getPurchaseController
};