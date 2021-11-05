import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace CreatePacketDTO {
    export interface Request {
        name: string;
        price: number;
        limit: number;
        currency: string;
        managerReward: number;
        refBonus: number;
        period: number;
        wisewinOption: boolean;
    };

    export interface ResponseData {
        packetId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};