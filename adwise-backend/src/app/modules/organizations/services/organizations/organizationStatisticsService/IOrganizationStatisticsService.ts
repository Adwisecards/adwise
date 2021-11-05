import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IPurchase } from "../../../../finance/models/Purchase";
import { IWallet } from "../../../../finance/models/Wallet";
import { IUserFinancialOperation } from "../../../../users/models/UserFinancialStatistics";
import { IClient } from "../../../models/Client";
import { ICoupon } from "../../../models/Coupon";
import { IOrganization } from "../../../models/Organization";
import { IOrganizationStatistics, IOrganizationStatisticsOperation } from "../../../models/OrganizationStatistics";

export interface IPurchaseStats {
    cashback: number;
    firstLevel: number;
    otherLevels: number;
    adwisePoints: number;
    managerPoints: number;
    organizationPoints: number;
    marketingSum: number;
    usedPointsSum: number;
    paymentGatewayPoints: number;
};

export interface IPurchaseWithStats extends IPurchase {
    stats: IPurchaseStats;
};

export interface ICouponStats {
    purchaseSum: number;
    cashbackSum: number;
    marketingSum: number;
    organizationPoints: number;
    quantity: number;
};

export interface ICouponWithStats extends ICoupon {
    stats: ICouponStats;
};

export interface IOrganizationFinancialStatisticsFigures {
    onlinePurchaseCount: number;
    cashPurchaseCount: number;
    
    onlineCashbackSum: number;
    cashCashbackSum: number;

    onlineMarketingSum: number;
    cashMarketingSum: number;

    onlinePurchaseSum: number;
    cashPurchaseSum: number;

    onlineProfitSum: number;
    cashProfitSum: number;

    withdrawnSum: number;
    paidToBankAccountSum: number;
    depositPayoutSum: number;

    onlineRefFirstLevelSum: number;
    cashRefFirstLevelSum: number;
    
    onlineRefOtherLevelSum: number;
    cashRefOtherLevelSum: number;

    onlineAdwiseSum: number;
    cashAdwiseSum: number;

    onlineManagerSum: number;
    cashManagerSum: number;

    onlinePaymentGatewaySum: number;
    cashPaymentGatewaySum: number;

    wallet: IWallet;
    purchases: IPurchaseWithStats[];
};

export interface IOrganizationStatisticsService {
    collectFinancialStatistics(organizationId: string, dateFrom?: Date, dateTo?: Date): Promise<Result<IOrganizationFinancialStatisticsFigures | null, UseCaseError | null>>;
    getPurchasesWithStats(purchases: IPurchase[]): Promise<Result<IPurchaseWithStats[] | null, UseCaseError | null>>;
    getClientStats(clients: IClient[], organizationId: string): Promise<Result<IClient[] | null, UseCaseError | null>>;
    getCouponsWithStats(coupons: ICoupon[]): Promise<Result<ICouponWithStats[] | null, UseCaseError | null>>;
};