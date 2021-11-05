import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IPacket } from "../../../models/Packet";

export namespace GetPacketsDTO {
    export interface Request {
        all: boolean;
    };
    
    export interface ResponseData {
        packets: IPacket[];
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};