import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IOrganization } from "../../../../organizations/models/Organization";

export namespace GetManagerOperationsDTO {
    export interface IManagerOperation {
        timestamp: Date;
        type: 'managerPercent' | 'packet' | 'packetRef';
        sum: number;
        organization: IOrganization;
    };

    export interface Request {
        userId: string;
        limit: number;
        page: number;
    };

    export interface ResponseData {
        operations: IManagerOperation[];
        count: number;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};