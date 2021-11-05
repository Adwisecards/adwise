import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace SetEmployeeDisabledDTO {
    export interface Request {
        employeeId: string;
        disabled: boolean;
    };

    export interface ResponseData {
        employeeId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};