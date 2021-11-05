import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IWallet } from "../../../../finance/models/Wallet";

export namespace GetWisewinStatisticsDTO {
    export interface Request {
        userId: string;
        wisewinId?: string;
    };

    export interface ResponseData {
        managerOrganizations: number;
        managerPercentSum: number;
        packetSum: number;
        packetRefSum: number;
        depositSum: number;
        wisewinPacket: string;
        remainingPackets: number;
        remainingStartPackets: number;
        totalSoldPackets: number;
        totalSoldStartPackets: number;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};