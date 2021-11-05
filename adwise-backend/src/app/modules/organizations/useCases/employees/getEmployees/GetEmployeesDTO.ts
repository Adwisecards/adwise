import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IEmployee } from "../../../models/Employee";

export namespace GetEmployeesDTO {
    export interface Request {
        organizationId: string;
    };

    export interface ResponseData {
        employees: IEmployee[];
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};