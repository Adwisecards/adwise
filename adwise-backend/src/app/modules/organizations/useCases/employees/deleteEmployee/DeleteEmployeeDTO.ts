import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace DeleteEmployeeDTO {
    export interface Request {
        employeeId: string
    };

    export interface ResponseData {
        employeeId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};