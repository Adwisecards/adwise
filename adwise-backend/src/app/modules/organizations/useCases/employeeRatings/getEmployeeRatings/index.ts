import { employeeRatingRepo } from "../../../repo/employeeRatings";
import { employeeRatingValidationService } from "../../../services/employeeRatings/employeeRatingValidationService";
import { GetEmployeeRatingsController } from "./GetEmployeeRatingsController";
import { GetEmployeeRatingsUseCase } from "./GetEmployeeRatingsUseCase";

export const getEmployeeRatingsUseCase = new GetEmployeeRatingsUseCase(
    employeeRatingRepo,
    employeeRatingValidationService
);

export const getEmployeeRatingsController = new GetEmployeeRatingsController(getEmployeeRatingsUseCase);