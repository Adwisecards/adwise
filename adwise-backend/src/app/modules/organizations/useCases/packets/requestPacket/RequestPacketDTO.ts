import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace RequestPacketDTO {
    export interface Request {
        email: string;
        packetId: string;
        userId: string;
        generateDocuments: boolean;
    };

    export interface ResponseData {
        packetId: string
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
}