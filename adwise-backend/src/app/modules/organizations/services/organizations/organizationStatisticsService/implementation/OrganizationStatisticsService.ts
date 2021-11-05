import { Result } from "../../../../../../core/models/Result";
import { UseCaseError } from "../../../../../../core/models/UseCaseError";
import { IPurchase } from "../../../../../finance/models/Purchase";
import { ITransaction } from "../../../../../finance/models/Transaction";
import { IWallet } from "../../../../../finance/models/Wallet";
import { IPurchaseRepo } from "../../../../../finance/repo/purchases/IPurchaseRepo";
import { ISubscriptionRepo } from "../../../../../finance/repo/subscriptions/ISubscriptionRepo";
import { ITransactionRepo } from "../../../../../finance/repo/transactions/ITransactionRepo";
import { IWalletRepo } from "../../../../../finance/repo/wallets/IWalletRepo";
import { CalculatePurchaseMarketingUseCase } from "../../../../../finance/useCases/purchases/calculatePurchaseMarketing/CalculatePurchaseMarketingUseCase";
import { IUser } from "../../../../../users/models/User";
import { IUserFinancialOperation } from "../../../../../users/models/UserFinancialStatistics";
import { GetUserFinancialStatisticsUseCase } from "../../../../../users/useCases/userFinancialStatistics/getUserFinancialStatistics/GetUserFinancialStatisticsUseCase";
import { IClient } from "../../../../models/Client";
import { ICoupon } from "../../../../models/Coupon";
import { IOrganization } from "../../../../models/Organization";
import { IOrganizationRepo } from "../../../../repo/organizations/IOrganizationRepo";
import { ICouponStats, ICouponWithStats, IOrganizationFinancialStatisticsFigures, IOrganizationStatisticsService, IPurchaseStats, IPurchaseWithStats } from "../IOrganizationStatisticsService";

interface IFinancialStatisticsKeyObjects {
    organization: IOrganization;
    wallet: IWallet;
    withdrawalTransactions: ITransaction[];
    purchases: IPurchaseWithStats[];
    cashTransactions: ITransaction[];
    correctTransactions: ITransaction[];
};

export class OrganizationStatisticsService implements IOrganizationStatisticsService {
    private walletRepo: IWalletRepo;
    private purchaseRepo: IPurchaseRepo;
    private transactionRepo: ITransactionRepo;
    private subscriptionRepo: ISubscriptionRepo;
    private organizationRepo: IOrganizationRepo;
    private calculatePurchaseMarketingUseCase: CalculatePurchaseMarketingUseCase;
    private getUserFinancialStatisticsUseCase: GetUserFinancialStatisticsUseCase;

    constructor(
        walletRepo: IWalletRepo,
        purchaseRepo: IPurchaseRepo,
        transactionRepo: ITransactionRepo,
        subscriptionRepo: ISubscriptionRepo,
        organizationRepo: IOrganizationRepo,
        calculatePurchaseMarketingUseCase: CalculatePurchaseMarketingUseCase,
        getUserFinancialStatisticsUseCase: GetUserFinancialStatisticsUseCase
    ) {
        this.walletRepo = walletRepo;
        this.purchaseRepo = purchaseRepo;
        this.transactionRepo = transactionRepo;
        this.subscriptionRepo = subscriptionRepo;
        this.organizationRepo = organizationRepo;
        this.calculatePurchaseMarketingUseCase = calculatePurchaseMarketingUseCase;
        this.getUserFinancialStatisticsUseCase = getUserFinancialStatisticsUseCase;
    }

    public async collectFinancialStatistics(organizationId: string, dateFrom?: Date, dateTo?: Date): Promise<Result<IOrganizationFinancialStatisticsFigures | null, UseCaseError | null>> {
        const financialStatisticsKeyObjectsGotten = await this.getFinancialStatisticsKeyObjects(organizationId, dateFrom, dateTo);
        if (financialStatisticsKeyObjectsGotten.isFailure) {
            return Result.fail(financialStatisticsKeyObjectsGotten.getError());
        }

        const {
            cashTransactions,
            correctTransactions,
            purchases,
            wallet,
            withdrawalTransactions
        } = financialStatisticsKeyObjectsGotten.getValue()!;

        const {
            onlineCashbackSum,
            cashCashbackSum,

            onlineMarketingSum,
            cashMarketingSum,

            onlineProfitSum,
            cashProfitSum,
            
            onlinePurchaseSum,
            cashPurchaseSum,

            withdrawnSum,
            paidToBankAccountSum,
            depositPayoutSum,
            
            onlineRefFirstLevelSum,
            cashRefFirstLevelSum,
            
            onlineRefOtherLevelSum,
            cashRefOtherLevelSum,

            onlineAdwiseSum,
            cashAdwiseSum,

            onlinePaymentGatewaySum,
            cashPaymentGatewaySum,

            onlineManagerSum,
            cashManagerSum,

            onlinePurchaseCount,
            cashPurchaseCount
        } = this.calculateFinancialStatistics(
            purchases,
            withdrawalTransactions,
            cashTransactions,
            correctTransactions
        );

        return Result.ok({
            cashAdwiseSum,
            cashCashbackSum,
            cashManagerSum,
            cashMarketingSum,
            cashPaymentGatewaySum,
            cashProfitSum,
            cashPurchaseSum,
            cashRefFirstLevelSum,
            cashRefOtherLevelSum,
            depositPayoutSum,
            onlineAdwiseSum,
            onlineCashbackSum,
            onlineManagerSum,
            onlineMarketingSum,
            onlinePaymentGatewaySum,
            onlineProfitSum,
            onlinePurchaseSum,
            onlineRefFirstLevelSum,
            onlineRefOtherLevelSum,
            paidToBankAccountSum,
            purchases,
            wallet,
            withdrawnSum,
            onlinePurchaseCount,
            cashPurchaseCount
        });
    }

    private calculateFinancialStatistics(
        purchases: IPurchaseWithStats[], 
        withdrawalTransactions: ITransaction[], 
        cashTransactions: ITransaction[],
        correctTransactions: ITransaction[]
    ): Omit<Omit<IOrganizationFinancialStatisticsFigures, 'purchases'>, 'wallet'> {
        const onlinePurchaseCount = purchases.filter(p => p.type == 'cashless').length;
        const cashPurchaseCount = purchases.filter(p => p.type == 'cash').length;
        
        const onlineCashbackSum = purchases.filter(p => p.type == 'cashless').reduce((sum, cur) => sum += cur.stats.cashback, 0);
        const cashCashbackSum = purchases.filter(p => p.type == 'cash').reduce((sum, cur) => sum += cur.stats.cashback, 0);

        const onlineMarketingSum = purchases.filter(p => p.type == 'cashless').reduce((sum, cur) => sum += cur.stats.marketingSum, 0);
        const cashMarketingSum = purchases.filter(p => p.type == 'cash').reduce((sum, cur) => sum += cur.stats.marketingSum, 0);

        const onlinePurchaseSum = purchases.filter(p => p.type == 'cashless').reduce((sum, cur) => sum += cur.sumInPoints, 0);
        const cashPurchaseSum = purchases.filter(p => p.type == 'cash').reduce((sum, cur) => sum += cur.sumInPoints, 0);

        const onlineProfitSum = purchases.filter(p => p.type == 'cashless').reduce((sum, cur) => sum += cur.stats.organizationPoints, 0);
        const cashProfitSum = purchases.filter(p => p.type == 'cash').reduce((sum, cur) => sum += cur.stats.organizationPoints, 0);

        const withdrawalSum = withdrawalTransactions.reduce((sum, cur) => sum += cur.sum, 0);
        const paidToBankAccountSum = correctTransactions.reduce((sum, cur) => sum += cur.sum, 0);
        const depositPayoutSum = cashTransactions.reduce((sum, cur) => sum += cur.sum, 0);
        
        const onlineAdwiseSum = purchases.filter(p => p.type == 'cashless').reduce((sum, cur) => sum += cur.stats.adwisePoints, 0);
        const cashAdwiseSum = purchases.filter(p => p.type == 'cash').reduce((sum, cur) => sum += cur.stats.adwisePoints, 0);

        const onlineRefFirstLevelSum = purchases.filter(p => p.type == 'cashless').reduce((sum, cur) => sum += cur.stats.firstLevel, 0);
        const cashRefFirstLevelSum = purchases.filter(p => p.type == 'cash').reduce((sum, cur) => sum += cur.stats.firstLevel, 0);

        const onlineRefOtherLevelSum = purchases.filter(p => p.type == 'cashless').reduce((sum, cur) => sum += cur.stats.otherLevels, 0);
        const cashRefOtherLevelSum = purchases.filter(p => p.type == 'cash').reduce((sum, cur) => sum += cur.stats.otherLevels, 0);

        const onlinePaymentGatewaySum = purchases.filter(p => p.type == 'cashless').reduce((sum, cur) => sum += cur.stats.paymentGatewayPoints, 0);
        const cashPaymentGatewaySum = purchases.filter(p => p.type == 'cash').reduce((sum, cur) => sum += cur.stats.paymentGatewayPoints, 0);

        const onlineManagerSum = purchases.filter(p => p.type == 'cashless').reduce((sum, cur) => sum += cur.stats.managerPoints, 0);
        const cashManagerSum = purchases.filter(p => p.type == 'cash').reduce((sum, cur) => sum += cur.stats.managerPoints, 0);

        return {
            onlineCashbackSum: this.formatNumber(onlineCashbackSum),
            cashCashbackSum: this.formatNumber(cashCashbackSum),

            onlineMarketingSum: this.formatNumber(onlineMarketingSum),
            cashMarketingSum: this.formatNumber(cashMarketingSum),

            onlineProfitSum: this.formatNumber(onlineProfitSum),
            cashProfitSum: this.formatNumber(cashProfitSum),
            
            onlinePurchaseSum: this.formatNumber(onlinePurchaseSum),
            cashPurchaseSum: this.formatNumber(cashPurchaseSum),

            withdrawnSum: this.formatNumber(withdrawalSum),
            paidToBankAccountSum: this.formatNumber(paidToBankAccountSum),
            depositPayoutSum: this.formatNumber(depositPayoutSum),
            
            onlineRefFirstLevelSum: this.formatNumber(onlineRefFirstLevelSum),
            cashRefFirstLevelSum: this.formatNumber(cashRefFirstLevelSum),
            
            onlineRefOtherLevelSum: this.formatNumber(onlineRefOtherLevelSum),
            cashRefOtherLevelSum: this.formatNumber(cashRefOtherLevelSum),

            onlineAdwiseSum: this.formatNumber(onlineAdwiseSum),
            cashAdwiseSum: this.formatNumber(cashAdwiseSum),

            onlinePaymentGatewaySum: this.formatNumber(onlinePaymentGatewaySum),
            cashPaymentGatewaySum: this.formatNumber(cashPaymentGatewaySum),

            onlineManagerSum: this.formatNumber(onlineManagerSum),
            cashManagerSum: this.formatNumber(cashManagerSum),

            onlinePurchaseCount: onlinePurchaseCount,
            cashPurchaseCount: cashPurchaseCount
        };
    }

    private async getFinancialStatisticsKeyObjects(organizationId: string, dateFrom?: Date, dateTo?: Date): Promise<Result<IFinancialStatisticsKeyObjects | null, UseCaseError | null>> {
        const organizationFound = await this.organizationRepo.findById(organizationId);
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
        }

        const organization = organizationFound.getValue()!;

        const walletFound = await this.walletRepo.findById(organization.wallet.toString());
        if (walletFound.isFailure) {
            return Result.fail(walletFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding wallet') : UseCaseError.create('r'));
        }

        const wallet = walletFound.getValue()!;

        const withdrawalTransactionsFound = await this.transactionRepo.findByTypeAndFrom('withdrawal', wallet._id.toString(), dateFrom, dateTo);
        if (withdrawalTransactionsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding withdrawal transactions'));
        }

        const withdrawalTransactions = withdrawalTransactionsFound.getValue()!.filter(t => !t.disabled);

        const purchasesFound = await this.purchaseRepo.findByOrganization(organizationId, 10000, 1, true, dateFrom?.toISOString(), dateTo?.toISOString(), 'timestamp', -1);
        if (purchasesFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding purchases'));
        }

        const purchases = purchasesFound.getValue()!.filter(p => !p.canceled);

        const purchasesWithStatsGotten = await this.getPurchasesWithStats(purchases);
        if (purchasesWithStatsGotten.isFailure) {
            return Result.fail(purchasesWithStatsGotten.getError());
        }

        const purchasesWithStats = purchasesWithStatsGotten.getValue()!;
        
        const cashTransactionsFound = await this.transactionRepo.findByFromAndOrigin((<any>organization.wallet)._id.toString(), 'cash', dateFrom, dateTo);
        if (cashTransactionsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding cash transactions'));
        }

        const cashTransactions = cashTransactionsFound.getValue()!.filter(t => !t.disabled);

        let keys = ['from', 'origin', 'type', 'disabled'];
        let values = [wallet._id, 'split', 'correct', 'false'];

        if (dateFrom) {
            keys.push('dateFrom');
            values.push(dateFrom.toISOString());
        }

        if (dateTo) {
            keys.push('dateTo');
            values.push(dateTo.toISOString());
        }

        const correctSplitTransactionsFound = await this.transactionRepo.search(
            keys,
            values,
            'timestamp',
            -1,
            9000,
            1
        );

        if (correctSplitTransactionsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding correct split transactions'));
        }

        const correctSplitTransactions = correctSplitTransactionsFound.getValue()!;

        keys = ['from', 'origin', 'type', 'disabled'];
        values = [wallet._id, 'safe', 'correct', 'false'];

        if (dateFrom) {
            keys.push('dateFrom');
            values.push(dateFrom.toISOString());
        }

        if (dateTo) {
            keys.push('dateTo');
            values.push(dateTo.toISOString());
        }

        const correctSafeTransactionsFound = await this.transactionRepo.search(
            keys,
            values,
            'timestamp',
            -1,
            9000,
            1
        );

        if (correctSafeTransactionsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding correct safe transactions'));
        }

        const correctSafeTransactions = correctSafeTransactionsFound.getValue()!;
        console.log(correctSafeTransactions);

        const correctTransactions = correctSafeTransactions.concat(correctSplitTransactions);

        return Result.ok({
            cashTransactions,
            correctTransactions,
            organization,
            purchases: purchasesWithStats,
            wallet,
            withdrawalTransactions
        });
    }

    public async getPurchasesWithStats(purchases: IPurchase[]): Promise<Result<IPurchaseWithStats[] | null, UseCaseError | null>> {
        const purchaseIds = purchases.map((p: IPurchase) => p._id.toString());

        const transactionsFound = await this.transactionRepo.findByContexts(purchaseIds);
        if (transactionsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding transactions'))
        }

        const transactions = transactionsFound.getValue()!.filter(t => !t.disabled);

        const purchasesWithStats: IPurchaseWithStats[] = [];
        purchases.map(p => {
            const stats: IPurchaseStats = {
                cashback: 0,
                firstLevel: 0,
                otherLevels: 0,
                adwisePoints: 0,
                managerPoints: 0,
                organizationPoints: 0,
                marketingSum: 0,
                usedPointsSum: 0,
                paymentGatewayPoints: 0
            };

            const contextTransactions = transactions.filter(t => t.context.toString() == p._id.toString());

            const cashbackTransactions = contextTransactions.filter(t => t.type == 'offer');
            if (cashbackTransactions.length) {
                stats.cashback = cashbackTransactions.reduce((sum, cur) => sum += cur.sum, 0);
            }

            const adwiseTransactions = contextTransactions.filter(t => t.type == 'adwise');
            if (adwiseTransactions.length) {
                stats.adwisePoints = adwiseTransactions.reduce((sum, cur) => sum += cur.sum, 0);
            }

            const managerTransactions = contextTransactions.filter(t => t.type == 'managerPercent');
            if (managerTransactions.length) {
                stats.managerPoints = managerTransactions.reduce((sum, cur) => sum += cur.sum, 0);
            }

            const couponCount = p.coupons.length;

            const refTransactions = contextTransactions.filter(t => t.type == 'ref').sort((a, b) => a.sum > b.sum ? -1 : 1);

            const firstLevelTransactions = refTransactions.slice(0, couponCount);
            if (firstLevelTransactions.length) {
                stats.firstLevel = firstLevelTransactions.reduce((sum, cur) => sum += cur.sum, 0);
            }

            const otherLevelTransactions = refTransactions.slice(couponCount);
            if (otherLevelTransactions.length) {
                stats.otherLevels = otherLevelTransactions.reduce((sum, cur) => sum += cur.sum, 0);
            }

            const purchaseTransactions = contextTransactions.filter(t => t.type == 'purchase');
        
            if (contextTransactions.length) {
                stats.organizationPoints = purchaseTransactions.reduce((sum, cur) => sum += cur.sum, 0); 
            }

            const refBackTransactions = contextTransactions.filter(t => t.type == 'refBackToOrganization');
            if (refBackTransactions.length) {
                stats.organizationPoints += refBackTransactions.reduce((sum, cur) => sum += cur.sum, 0);
            }

            const usedPointsTransactions = contextTransactions.filter(t => t.type == 'usedPoints');
            if (usedPointsTransactions.length) {
                stats.usedPointsSum = usedPointsTransactions.reduce((sum, cur) => sum += cur.sum, 0);
            }

            const paymentGatewayTransactions = contextTransactions.filter(t => t.type == 'paymentGateway');
            if (paymentGatewayTransactions.length) {
                stats.paymentGatewayPoints = paymentGatewayTransactions.reduce((sum, cur) => sum += cur.sum, 0);
            }

            stats.marketingSum = (stats.adwisePoints + stats.managerPoints + stats.firstLevel + stats.otherLevels + stats.paymentGatewayPoints);

            p = p.toObject ? p.toObject() : p;

            purchasesWithStats.push({...p as any, stats: {
                adwisePoints: this.formatNumber(stats.adwisePoints),
                cashback: this.formatNumber(stats.cashback),
                firstLevel: this.formatNumber(stats.firstLevel),
                managerPoints: this.formatNumber(stats.managerPoints),
                marketingSum: this.formatNumber(stats.marketingSum),
                organizationPoints: this.formatNumber(stats.organizationPoints),
                otherLevels: this.formatNumber(stats.otherLevels),
                paymentGatewayPoints: this.formatNumber(stats.paymentGatewayPoints),
                usedPointsSum: this.formatNumber(stats.usedPointsSum)
            }});
        });

        return Result.ok(purchasesWithStats);
    }

    public async getClientStats(clients: IClient[], organizationId: string): Promise<Result<IClient[] | null, UseCaseError | null>> {
        let purchaserIds: string[] = [];

        const organizationFound = await this.organizationRepo.findById(organizationId);
        if (organizationFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding organization'));
        }

        const organization = organizationFound.getValue()!;
        
        for (const client of clients) {
            if ((<any>client.contact)._id) {
                purchaserIds.push((<any>client.contact)._id);
            } else {
                purchaserIds.push(client.contact.toString());
            }
        } 
        const purchasesFound = await this.purchaseRepo.findByPurchaserIdsAndOrganizationAndConfirmed(purchaserIds, organizationId, true);
        if (purchasesFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding purchases'));
        }

        const purchases = purchasesFound.getValue()!.filter(p => !p.canceled);

        const purchasesWithStatsGotten = await this.getPurchasesWithStats(purchases);
        if (purchasesWithStatsGotten.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting purchases with stats'));
        }

        const purchasesWithStats = purchasesWithStatsGotten.getValue()!;

        const clientsWithStats: IClient[] = [];

        for (const client of clients) {
            let clientPurchases: IPurchaseWithStats[] = [];

            if ((<any>client.contact)._id) {
                clientPurchases = purchasesWithStats.filter(p => p.purchaser.toString() == (<any>client.contact)._id.toString());
            } else {
                clientPurchases = purchasesWithStats.filter(p => p.purchaser.toString() == client.contact.toString());
            }

            const purchaseCount = clientPurchases.length;

            const purchaseSum = clientPurchases.reduce((sum, cur) => sum += cur.sumInPoints, 0);

            const cashbackSum = clientPurchases.reduce((sum, cur) => sum += cur.stats.cashback, 0);

            const usedPointsSum = clientPurchases.reduce((sum, cur) => sum += cur.stats.usedPointsSum, 0);

            const userFinancialStatisticsGotten = await this.getUserFinancialStatisticsUseCase.execute({
                userId: client.user.toString(),
                noUpdate: true
            });

            if (userFinancialStatisticsGotten.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding user financial statistics'));
            }

            let operations: IUserFinancialOperation[] = [];

            if (clients.length == 1) {
                const userFinancialStatistics = userFinancialStatisticsGotten.getValue()!;

                operations = userFinancialStatistics.operations
                    .filter(o => o.type == 'marketing' || o.type == 'purchase')
                    .filter(o => o.organizationName == organization.name);
            }

            let subscriptionCount = 0;

            const subscriptionFound = await this.subscriptionRepo.findByUserAndOrganization(client.user.toString(), client.organization.toString());
            if (subscriptionFound.isSuccess) {
                const subscription = subscriptionFound.getValue()!;

                const childSubscriptionsFound = await this.subscriptionRepo.findByParentsAndOrganization([subscription._id.toString()], organizationId);
                if (childSubscriptionsFound.isSuccess) {
                    const childSubscriptions = childSubscriptionsFound.getValue()!;
                    subscriptionCount = childSubscriptions.length;
                }
            }

            client.stats = {
                cashbackSum: this.formatNumber(cashbackSum),
                purchaseCount: this.formatNumber(purchaseCount),
                purchaseSum: this.formatNumber(purchaseSum),
                usedPointsSum: this.formatNumber(usedPointsSum),
                purchases: clientPurchases,
                operations: operations as any,
                updatedAt: new Date(),
                subscriptionCount: subscriptionCount
            }
        }

        return Result.ok(clients);
    }

    public async getCouponsWithStats(coupons: ICoupon[]): Promise<Result<ICouponWithStats[] | null, UseCaseError | null>> {
        const couponIds: string[] = coupons.map(c => c._id.toString());
        
        const purchasesFound = await this.purchaseRepo.findManyByCoupons(couponIds);
        if (purchasesFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding purchases'));
        }

        const purchases = purchasesFound.getValue()!.filter(p => p.confirmed && !p.canceled && !p.archived);
        
        const purchasesWithStatsGotten = await this.getPurchasesWithStats(purchases);
        if (purchasesWithStatsGotten.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting purchases with stats'));
        }

        const purchasesWithStats = purchasesWithStatsGotten.getValue()!;

        const couponsWithStats: ICouponWithStats[] = [];

        for (const coupon of coupons) {
            const couponPurchases = purchasesWithStats.filter(p => !!p.coupons.find(c => c._id.toString() == coupon._id.toString()));
            const purchaseCoupons = [];

            let couponInPurchasesCount = 0;
            let purchaseSum = 0;
            let cashbackSum = 0;
            let marketingSum = 0;
            let organizationPoints = 0;

            for (const couponPurchase of couponPurchases) {
                const couponPurchaseMarketingCalculated = await this.calculatePurchaseMarketingUseCase.execute({
                    purchase: couponPurchase
                });

                if (couponPurchaseMarketingCalculated.isFailure) {
                    continue;
                }

                const {
                    couponsWithMarketing
                } = couponPurchaseMarketingCalculated.getValue()!;

                purchaseCoupons.push(...couponsWithMarketing);
            }

            for (const purchaseCoupon of purchaseCoupons) {
                if (purchaseCoupon.coupon._id.toString() == coupon._id.toString()) {
                    couponInPurchasesCount++;
                    purchaseSum += purchaseCoupon.coupon.price;
                    cashbackSum += purchaseCoupon.offerSum;
                    marketingSum += purchaseCoupon.adwiseSumForCash + purchaseCoupon.paymentGatewaySum + purchaseCoupon.refSum;
                }
            }

            const stats: ICouponStats = {
                cashbackSum: this.formatNumber(cashbackSum),
                marketingSum: this.formatNumber(marketingSum),
                purchaseSum: this.formatNumber(purchaseSum),
                organizationPoints: this.formatNumber(organizationPoints),
                quantity: coupon.initialQuantity - couponInPurchasesCount
            };

            if (stats.quantity < 0) {
                stats.quantity = 0;
            }

            const couponWithStats: ICouponWithStats = {
                ...coupon.toObject(),
                stats
            };

            couponsWithStats.push(couponWithStats);
        }

        return Result.ok(couponsWithStats);
    }

    private formatNumber(number: number): number {
        return Number((Math.round(100 * number) / 100).toFixed(2))
    }
};