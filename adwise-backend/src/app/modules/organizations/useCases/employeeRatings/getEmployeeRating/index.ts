import { employeeRatingRepo } from "../../../repo/employeeRatings";
import { employeeRatingValidationService } from "../../../services/employeeRatings/employeeRatingValidationService";
import { GetEmployeeRatingController } from "./GetEmployeeRatingController";
import { GetEmployeeRatingUseCase } from "./GetEmployeeRatingUseCase";

export const getEmployeeRatingUseCase = new GetEmployeeRatingUseCase(
    employeeRatingRepo,
    employeeRatingValidationService
);

export const getEmployeeRatingController = new GetEmployeeRatingController(
    getEmployeeRatingUseCase
);