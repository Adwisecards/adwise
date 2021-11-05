import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace DeletePacketDTO {
    export interface Request {
        packetId: string;
    };

    export interface ResponseData {
        packetId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};