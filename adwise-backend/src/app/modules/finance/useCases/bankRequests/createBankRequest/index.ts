import { paymentService } from "../../../../../services/paymentService";
import { bankRequestRepo } from "../../../repo/bankRequests";
import { CreateBankRequestUseCase } from "./CreateBankRequestUseCase";

export const createBankRequestUseCase = new CreateBankRequestUseCase(bankRequestRepo, paymentService);