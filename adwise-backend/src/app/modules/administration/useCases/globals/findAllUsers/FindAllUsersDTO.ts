import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IWisewinUser } from "../../../../../services/wisewinService/IWisewinService";
import { IUser } from "../../../../users/models/User";
import { IUserFinancialStatistics } from "../../../../users/models/UserFinancialStatistics";

export namespace FindAllUsersDTO {
    export interface IUserWithStatsAndWisewinInfo extends IUser {
        stats: IUserFinancialStatistics;
        wisewinInfo: {
            packet: string;
            remainingPackets: number;
            remainingStartPackets: number;
        };
    };

    export interface Request {
        [key: string]: string | number | boolean;
        sortBy: string;
        order: number;
        pageSize: number;
        pageNumber: number;
        export: boolean;
    };

    export interface ResponseData {
        users: IUserWithStatsAndWisewinInfo[];
        count: number;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};