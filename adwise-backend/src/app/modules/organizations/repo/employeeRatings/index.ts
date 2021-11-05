import { EmployeeRatingModel } from "../../models/EmployeeRating";
import { EmployeeRatingRepo } from "./implementation/EmployeeRatingRepo";

export const employeeRatingRepo = new EmployeeRatingRepo(EmployeeRatingModel);