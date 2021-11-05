import { employeeRepo } from "../../../repo/employees";
import { ChangeEmployeeRoleController } from "./ChangeEmployeeRoleController";
import { ChangeEmployeeRoleUseCase } from "./ChangeEmployeeRoleUseCase";

const changeEmployeeRoleUseCase = new ChangeEmployeeRoleUseCase(employeeRepo);
const changeEmployeeRoleController = new ChangeEmployeeRoleController(changeEmployeeRoleUseCase);

export {
    changeEmployeeRoleUseCase,
    changeEmployeeRoleController
};