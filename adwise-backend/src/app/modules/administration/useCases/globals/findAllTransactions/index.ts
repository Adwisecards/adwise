import { xlsxService } from "../../../../../services/xlsxService";
import { transactionRepo } from "../../../../finance/repo/transactions";
import { administrationValidationService } from "../../../services/administrationValidationService";
import { FindAllTransactionsController } from "./FindAllTransactionsController";
import { FindAllTransactionsUseCase } from "./FindAllTransactionsUseCase";

const findAllTransactionsUseCase = new FindAllTransactionsUseCase(transactionRepo, administrationValidationService, xlsxService);
const findAllTransactionsController = new FindAllTransactionsController(findAllTransactionsUseCase);

export {
    findAllTransactionsUseCase,
    findAllTransactionsController
};