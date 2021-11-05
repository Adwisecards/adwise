import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IClient } from "../../../models/Client";

export namespace GetOrganizationClientsDTO {
    export interface Request {
        limit: number;
        page: number;
        organizationId: string;
        sortBy?: string;
        order?: number;
        export?: boolean;
        search?: string;
    };

    export interface ResponseData {
        clients: IClient[];
        count: number;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};