import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ITransaction } from "../../../../finance/models/Transaction";

export namespace GetOrganizationReportDTO {
    export interface Request {
        organizationId: string;
    };

    export interface ResponseData {
        filename: string;
        data: Buffer;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};