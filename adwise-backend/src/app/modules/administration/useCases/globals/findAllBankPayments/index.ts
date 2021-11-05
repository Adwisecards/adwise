import { transactionRepo } from "../../../../finance/repo/transactions";
import { administrationValidationService } from "../../../services/administrationValidationService";
import { FindAllBankPaymentsController } from "./FindAllBankPaymentsController";
import { FindAllBankPaymentsUseCase } from "./FindAllBankPaymentsUseCase";

export const findAllBankPaymentsUseCase = new FindAllBankPaymentsUseCase(administrationValidationService, transactionRepo);
export const findAllBankPaymentsController = new FindAllBankPaymentsController(findAllBankPaymentsUseCase);