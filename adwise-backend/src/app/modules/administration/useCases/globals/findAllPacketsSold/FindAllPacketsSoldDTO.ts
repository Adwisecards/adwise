import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IPacketSoldRecord } from "../../../../finance/models/PacketSoldRecord";
import { IOrganization } from "../../../../organizations/models/Organization";
import { IPacket } from "../../../../organizations/models/Packet";
import { IUser } from "../../../../users/models/User";

export namespace FindAllPacketsSoldDTO {    
    export interface Request {
        [key: string]: string | number | boolean;
        sortBy: string;
        order: number;
        pageSize: number;
        pageNumber: number;

        export: boolean;
    };

    export interface ResponseData {
        packets: IPacketSoldRecord[];
        count: number;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};