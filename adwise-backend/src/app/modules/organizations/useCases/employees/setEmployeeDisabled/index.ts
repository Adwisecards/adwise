import { employeeRepo } from "../../../repo/employees";
import { SetEmployeeDisabledController } from "./SetEmployeeDisabledController";
import { SetEmployeeDisabledUseCase } from "./SetEmployeeDisabledUseCase";

const setEmployeeDisabledUseCase = new SetEmployeeDisabledUseCase(employeeRepo);
const setEmployeeDisabledController = new SetEmployeeDisabledController(setEmployeeDisabledUseCase);

export {
    setEmployeeDisabledUseCase,
    setEmployeeDisabledController
};