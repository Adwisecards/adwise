import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace CreateEmployeeDTO {
    export interface Request {
        organizationId: string;
        contactId: string;
        role: string;
        defaultCashier: boolean;
    };

    export interface ResponseData {
        employeeId: string;
        employeeContactId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};