import { wisewinService } from "../../../../../services/wisewinService";
import { xlsxService } from "../../../../../services/xlsxService";
import { userRepo } from "../../../../users/repo/users";
import { getUserFinancialStatisticsUseCase } from "../../../../users/useCases/userFinancialStatistics/getUserFinancialStatistics";
import { administrationValidationService } from "../../../services/administrationValidationService";
import { FindAllUsersController } from "./FindAllUsersController";
import { FindAllUsersUseCase } from "./FindAllUsersUseCase";

const findAllUsersUseCase = new FindAllUsersUseCase(
    administrationValidationService, 
    userRepo, 
    wisewinService,
    getUserFinancialStatisticsUseCase,
    xlsxService
);
const findAllUsersController = new FindAllUsersController(findAllUsersUseCase);

export {
    findAllUsersUseCase,
    findAllUsersController
};