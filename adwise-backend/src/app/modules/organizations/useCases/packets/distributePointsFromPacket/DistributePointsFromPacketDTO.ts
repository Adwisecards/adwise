import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace DistributePointsFromPacketDTO {
    export interface Request {
        userId: string;
        refBonus: number;
        context: string;
        currency: string;
        count?: number;
    };

    export interface ResponseData {
        userId: string;
        refBonus: number;
        context: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};