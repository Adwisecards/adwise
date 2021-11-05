import { employeeRepo } from "../../../repo/employees";
import { GetOrganizationEmployeesController } from "./GetOrganizationEmployeesController";
import { GetOrganizationEmployeesUseCase } from "./GetOrganizationEmployeesUseCase";

const getOrganizationEmployeesUseCase = new GetOrganizationEmployeesUseCase(employeeRepo);
const getOrganizationEmployeesController = new GetOrganizationEmployeesController(getOrganizationEmployeesUseCase);

export {
    getOrganizationEmployeesUseCase,
    getOrganizationEmployeesController
};