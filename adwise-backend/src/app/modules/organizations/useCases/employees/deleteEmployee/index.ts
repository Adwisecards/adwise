import { deleteContactUseCase } from "../../../../contacts/useCases/contacts/deleteContact";
import { employeeRepo } from "../../../repo/employees";
import { organizationRepo } from "../../../repo/organizations";
import { DeleteEmployeeController } from "./DeleteEmployeeController";
import { DeleteEmployeeUseCase } from "./DeleteEmployeeUseCase";

const deleteEmployeeUseCase = new DeleteEmployeeUseCase(employeeRepo, organizationRepo, deleteContactUseCase);
const deleteEmployeeController = new DeleteEmployeeController(deleteEmployeeUseCase);

export {
    deleteEmployeeUseCase,
    deleteEmployeeController
};