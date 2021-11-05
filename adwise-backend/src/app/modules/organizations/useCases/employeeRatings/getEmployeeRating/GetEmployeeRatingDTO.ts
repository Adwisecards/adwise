import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IEmployeeRating } from "../../../models/EmployeeRating";

export namespace GetEmployeeRatingDTO {
    export interface Request {
        employeeRatingId: string;
    };

    export interface ResponseData {
        employeeRating: IEmployeeRating;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};