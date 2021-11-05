import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace SetOrganizationPacketDTO {
    export interface Request {
        organizationId: string;
        packetId: string;
        date: string;
        noRecord: boolean;
        asWisewinOption?: boolean;
        reason?: string;
    };

    export interface ResponseData {
        organizationId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};