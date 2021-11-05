import { contactRepo } from "../../../../contacts/repo/contacts";
import { userRepo } from "../../../../users/repo/users";
import { employeeRepo } from "../../../repo/employees";
import { organizationRepo } from "../../../repo/organizations";
import { RepointDefaultCashierUseCase } from "./RepointDefaultCashierUseCase";

export const repointDefaultCashierUseCase = new RepointDefaultCashierUseCase(employeeRepo, contactRepo, organizationRepo, userRepo);