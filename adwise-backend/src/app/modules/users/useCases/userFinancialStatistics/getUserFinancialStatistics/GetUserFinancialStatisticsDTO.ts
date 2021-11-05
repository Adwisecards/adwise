import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IWallet } from "../../../../finance/models/Wallet";
import { IUserFinancialStatistics } from "../../../models/UserFinancialStatistics";

export namespace GetUserFinancialStatisticsDTO {
    export interface Request {
        userId: string;
        noUpdate?: boolean;
    };

    export interface ResponseData extends IUserFinancialStatistics {
        wallet: IWallet;
    };

    export type Response = Result<IUserFinancialStatistics | null, UseCaseError | null>;
};