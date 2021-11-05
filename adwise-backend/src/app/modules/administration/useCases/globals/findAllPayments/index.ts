import { xlsxService } from "../../../../../services/xlsxService";
import { paymentRepo } from "../../../../finance/repo/payments";
import { administrationValidationService } from "../../../services/administrationValidationService";
import { FindAllPaymentsController } from "./FindAllPaymentsController";
import { FindAllPaymentsUseCase } from "./FindAllPaymentsUseCase";

const findAllPaymentsUseCase = new FindAllPaymentsUseCase(
    xlsxService,
    paymentRepo, 
    administrationValidationService
);
const findAllPaymentsController = new FindAllPaymentsController(findAllPaymentsUseCase);

export {
    findAllPaymentsUseCase,
    findAllPaymentsController
};