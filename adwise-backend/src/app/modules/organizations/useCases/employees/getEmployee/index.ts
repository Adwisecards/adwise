import { employeeRepo } from "../../../repo/employees";
import { employeeValidationService } from "../../../services/employees/employeeValidationService";
import { GetEmployeeController } from "./GetEmployeeController";
import { GetEmployeeUseCase } from "./GetEmployeeUseCase";

export const getEmployeeUseCase = new GetEmployeeUseCase(employeeRepo, employeeValidationService);
export const getEmployeeController = new GetEmployeeController(getEmployeeUseCase);