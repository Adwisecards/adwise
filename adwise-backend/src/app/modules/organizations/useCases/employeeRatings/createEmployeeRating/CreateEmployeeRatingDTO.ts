import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IEmployeeRating } from "../../../models/EmployeeRating";

export namespace CreateEmployeeRatingDTO {
    export interface Request {
        employeeContactId: string;
        purchaserContactId: string;
        rating: number;
        comment: string;
        purchaserUserId: string;
        purchaseId: string;
    };

    export interface ResponseData {
        employeeRating: IEmployeeRating;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};