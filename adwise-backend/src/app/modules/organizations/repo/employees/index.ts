import { EmployeeModel } from "../../models/Employee";
import { EmployeeRepo } from "./implementation/EmployeeRepo";

const employeeRepo = new EmployeeRepo(EmployeeModel);

export {
    employeeRepo
};