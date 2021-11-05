import { globalRepo } from "../../../../administration/repo/globals";
import { employeeRepo } from "../../../../organizations/repo/employees";
import { organizationRepo } from "../../../../organizations/repo/organizations";
import { userRepo } from "../../../../users/repo/users";
import { purchaseRepo } from "../../../repo/purchases";
import { tipsRepo } from "../../../repo/tips";
import { tipsValidationService } from "../../../services/tips/tipsValidationService";
import { createPaymentUseCase } from "../../payments/createPayment";
import { SendTipsController } from "./SendTipsController";
import { SendTipsUseCase } from "./SendTipsUseCase";

export const sendTipsUseCase = new SendTipsUseCase(
    tipsRepo, 
    userRepo, 
    employeeRepo, 
    tipsValidationService, 
    createPaymentUseCase, 
    organizationRepo,
    globalRepo,
    purchaseRepo
);
export const sendTipsController = new SendTipsController(sendTipsUseCase);