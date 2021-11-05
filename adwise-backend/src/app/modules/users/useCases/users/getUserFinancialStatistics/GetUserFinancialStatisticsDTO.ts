import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IPurchase } from "../../../../finance/models/Purchase";
import { IWallet } from "../../../../finance/models/Wallet";

export namespace GetUserFinancialStatisticsDTO {
    export interface IOperation {
        type: 'purchase' | 'marketing' | 'withdrawal';
        sum: number;
        timestamp: Date;
        organizationName?: string;
        couponName?: string;

        bonusPoints?: number; // purchase
        level?: string; // marketing,
        refPoints?: number; // marketing
    };

    export interface Request {
        userId: string;
        optimized: boolean;
    };

    export interface ResponseData {
        wallet: IWallet;
        operations: IOperation[];
        purchases: IPurchase[];
        purchaseSum: number;
        refCount: number;
        bonusSum: number;
        marketingSum: number;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};