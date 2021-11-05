import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace CreatePacketSoldRecordsDTO {
    export interface Request {

    };

    export interface ResponseData {
        packetSoldRecordIds: string[];
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
}