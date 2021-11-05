import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IEmployee } from "../../../models/Employee";

export namespace GetOrganizationEmployeesDTO {
    export interface Request {
        limit: number;
        page: number;
        role: string;
        organizationId: string;
        all: boolean;
    };

    export interface ResponseData {
        employees: IEmployee[];
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};