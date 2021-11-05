import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace ChooseWisewinOptionPacketDTO {
    export interface Request {
        userId: string;
        packetId: string;
    };

    export interface ResponseData {
        packetId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};