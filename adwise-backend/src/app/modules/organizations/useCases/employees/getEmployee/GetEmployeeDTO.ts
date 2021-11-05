import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IEmployee } from "../../../models/Employee";

export namespace GetEmployeeDTO {
    export interface Request {
        employeeId: string;
    };

    export interface ResponseData {
        employee: IEmployee;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};