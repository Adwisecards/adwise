import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace ChangeEmployeeRoleDTO {
    export interface Request {
        employeeId: string;
        role: string;
    };

    export interface ResponseData {
        employeeId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};