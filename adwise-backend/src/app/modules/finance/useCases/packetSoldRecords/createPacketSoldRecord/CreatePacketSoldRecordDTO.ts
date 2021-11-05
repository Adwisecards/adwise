import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IOrganization } from "../../../../organizations/models/Organization";
import { IPacket } from "../../../../organizations/models/Packet";
import { IUser } from "../../../../users/models/User";

export namespace CreatePacketSoldRecordDTO {
    export interface Request {
        organization: IOrganization;
        manager?: IUser;
        packet: IPacket;
        date: Date;
        reason?: string;
    };

    export interface ResponseData {
        packetSoldRecordId: string; 
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};