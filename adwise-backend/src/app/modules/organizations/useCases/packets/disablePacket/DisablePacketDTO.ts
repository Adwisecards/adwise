import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace DisablePacketDTO {
    export interface Request {
        packetId: string;
        disabled: boolean;
    };

    export interface ResponseData {
        packetId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};