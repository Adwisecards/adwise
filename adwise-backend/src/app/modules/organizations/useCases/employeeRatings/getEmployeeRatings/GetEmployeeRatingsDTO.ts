import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IEmployeeRating } from "../../../models/EmployeeRating";

export namespace GetEmployeeRatingsDTO {
    export interface Request {
        employeeId: string;
        page: number;
        limit: number;
    };

    export interface ResponseData {
        employeeRatings: IEmployeeRating[];
        count: number;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};