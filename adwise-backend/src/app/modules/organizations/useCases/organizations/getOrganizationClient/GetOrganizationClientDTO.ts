import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IClient } from "../../../models/Client";

export namespace GetOrganizationClientDTO {
    export interface Request {
        clientId: string;
    };

    export interface ResponseData {
        client: IClient;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};