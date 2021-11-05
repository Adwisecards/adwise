import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace UpdatePacketDTO {
    export interface Request {
        packetId: string;
        name: string;
        price: number;
        wisewinOption: boolean;
    };

    export interface ResponseData {
        packetId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};  