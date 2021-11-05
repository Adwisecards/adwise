import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace AddPacketToOrganizationDTO {
    export interface Request {
        packetId?: string;
        organizationId: string;
        default: boolean;
        date: string | Date;
        reason?: string;
        customPacket?: {
            price: number;
            name: string;
            managerReward: number;
            refBonus: number;
            currency: string;
            limit: number;
        };
    };

    export interface ResponseData {
        packetId: string;
        organizationId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};