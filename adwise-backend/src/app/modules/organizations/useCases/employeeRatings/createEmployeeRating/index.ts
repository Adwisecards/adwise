import { contactRepo } from "../../../../contacts/repo/contacts";
import { purchaseRepo } from "../../../../finance/repo/purchases";
import { userRepo } from "../../../../users/repo/users";
import { employeeRatingRepo } from "../../../repo/employeeRatings";
import { employeeRepo } from "../../../repo/employees";
import { organizationRepo } from "../../../repo/organizations";
import { employeeRatingValidationService } from "../../../services/employeeRatings/employeeRatingValidationService";
import { CreateEmployeeRatingController } from "./CreateEmployeeRatingController";
import { CreateEmployeeRatingUseCase } from "./CreateEmployeeRatingUseCase";

export const createEmployeeRatingUseCase = new CreateEmployeeRatingUseCase(
    employeeRatingRepo, 
    employeeRatingValidationService, 
    employeeRepo, 
    contactRepo, 
    userRepo, 
    organizationRepo,
    purchaseRepo
);
export const createEmployeeRatingController = new CreateEmployeeRatingController(createEmployeeRatingUseCase);