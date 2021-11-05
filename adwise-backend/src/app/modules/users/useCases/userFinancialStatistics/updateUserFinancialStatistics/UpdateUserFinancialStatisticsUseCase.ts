import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { logger } from "../../../../../services/logger";
import { ITransaction } from "../../../../finance/models/Transaction";
import { ISubscriptionRepo } from "../../../../finance/repo/subscriptions/ISubscriptionRepo";
import { ITransactionRepo } from "../../../../finance/repo/transactions/ITransactionRepo";
import { IWalletRepo } from "../../../../finance/repo/wallets/IWalletRepo";
import { IUser } from "../../../models/User";
import { IUserFinancialOperation, IUserFinancialStatistics, UserFinancialStatisticsModel } from "../../../models/UserFinancialStatistics";
import { IUserFinancialStatisticsRepo } from "../../../repo/userFinancialStatistics/IUserFinancialStatisticsRepo";
import { IUserRepo } from "../../../repo/users/IUserRepo";
import { UpdateUserFinancialStatisticsDTO } from "./UpdateUserFinancialStatisticsDTO";
import { updateUserFinancialStatisticsErrors } from "./updateUserFinancialStatisticsErrors";

interface IKeyObjects {
    toTransactions: ITransaction[];
    fromTransactions: ITransaction[];
    transactions: ITransaction[];
    refCount: number;
};

export class UpdateUserFinancialStatisticsUseCase implements IUseCase<UpdateUserFinancialStatisticsDTO.Request, UpdateUserFinancialStatisticsDTO.Response> {
    private walletRepo: IWalletRepo;
    private userRepo: IUserRepo;
    private transactionRepo: ITransactionRepo;
    private subscriptionRepo: ISubscriptionRepo;
    private userFinancialStatisticsRepo: IUserFinancialStatisticsRepo;

    public errors = [
        ...updateUserFinancialStatisticsErrors
    ];

    constructor(
        walletRepo: IWalletRepo, 
        userRepo: IUserRepo, 
        transactionRepo: ITransactionRepo, 
        subscriptionRepo: ISubscriptionRepo,
        userFinancialStatisticsRepo: IUserFinancialStatisticsRepo
    ) {
        this.walletRepo = walletRepo;
        this.userRepo = userRepo;
        this.transactionRepo = transactionRepo;
        this.subscriptionRepo = subscriptionRepo;
        this.userFinancialStatisticsRepo = userFinancialStatisticsRepo;
    }

    public async execute(req: UpdateUserFinancialStatisticsDTO.Request): Promise<UpdateUserFinancialStatisticsDTO.Response> {
        let users: IUser[] = [];
        
        if (!req.userId) {
            const usersFound = await this.userRepo.getAll();
            if (usersFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding users'));
            }

            users = usersFound.getValue()!;
        } else {
            const userFound = await this.userRepo.findById(req.userId);
            if (userFound.isFailure) {
                console.log(req.userId);
                return Result.fail(UseCaseError.create('a', 'Error upon finding user'));
            }

            users = [userFound.getValue()!];
        }

        for (const user of users) {
            logger.info('SYSTEM: About to update user financial statistics of user with id:', user._id);
            const userFinancialStatisticsUpdated = await this.main(user._id, !req.userId);
            if (userFinancialStatisticsUpdated.isFailure) {
                const error = userFinancialStatisticsUpdated.getError()!;
                logger.info('Error upon finding updating financial statistics for user with id of '+user._id.toString());
                logger.error(error.stack!, error.message, error.details);
            }
        }

        return Result.ok({});
    }

    private async main(userId: string, all: boolean): Promise<Result<true | null, UseCaseError | null>> {
        if (!Types.ObjectId.isValid(userId)) {
            return Result.fail(UseCaseError.create('c', 'userId is not valid'));
        }

        const userFinancialStatisticsGotten = await this.getUserFinancialStatistics(userId);
        if (userFinancialStatisticsGotten.isFailure) {
            return Result.fail(userFinancialStatisticsGotten.getError()!);
        }

        const userFinancialStatistics = userFinancialStatisticsGotten.getValue()!;

        let dateFrom = new Date(36000000);

        if (!all) {
            const lastTransaction = userFinancialStatistics.operations[0];
            if (lastTransaction) {
                console.log(lastTransaction);
                dateFrom = lastTransaction.timestamp;
            }

            dateFrom.setSeconds(dateFrom.getSeconds()+1);
        }

        const keyObjectsGotten = await this.getKeyObjects(userId, dateFrom);
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError()!);
        }

        const {
            fromTransactions,
            toTransactions,
            transactions,
            refCount
        } = keyObjectsGotten.getValue()!;

        const statisticsCalculated = this.calculateStatistics(fromTransactions, toTransactions, transactions, refCount);
        if (statisticsCalculated.isFailure) {
            return Result.fail(statisticsCalculated.getError());
        }

        let {
            bonusSum,
            marketingSum,
            operations,
            purchaseSum,
            purchases,
            usedPointsSum,
            withdrawalSum,
            managerPercentSum
        } = statisticsCalculated.getValue()!;

        userFinancialStatistics.updatedAt = new Date();

        if (!all) {
            userFinancialStatistics.bonusSum += bonusSum + marketingSum + managerPercentSum;
            userFinancialStatistics.marketingSum += marketingSum;
            userFinancialStatistics.purchaseSum += purchaseSum;
            userFinancialStatistics.usedPointsSum += usedPointsSum;
            userFinancialStatistics.withdrawalSum += withdrawalSum;
            userFinancialStatistics.managerPercentSum += managerPercentSum;
        } else {
            userFinancialStatistics.bonusSum = bonusSum + marketingSum + managerPercentSum;
            userFinancialStatistics.marketingSum = marketingSum;
            userFinancialStatistics.purchaseSum = purchaseSum;
            userFinancialStatistics.usedPointsSum = usedPointsSum;
            userFinancialStatistics.withdrawalSum = withdrawalSum;
            userFinancialStatistics.managerPercentSum = managerPercentSum;
        }

        userFinancialStatistics.refCount = refCount;

        if (!all) {
            operations = operations.concat(userFinancialStatistics.operations);
            purchases = purchases.concat(userFinancialStatistics.purchases);
        }

        userFinancialStatistics.operations = operations;
        userFinancialStatistics.purchases = purchases;

        const userFinancialStatisticsSaved = await this.userFinancialStatisticsRepo.save(userFinancialStatistics);
        if (userFinancialStatisticsSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving user financial statistics'));
        }

        return Result.ok(true);
    }

    private async getUserFinancialStatistics(userId: string): Promise<Result<IUserFinancialStatistics | null, UseCaseError | null>> {
        const userFinancialStatisticsFound = await this.userFinancialStatisticsRepo.findByUser(userId);
        if (userFinancialStatisticsFound.isFailure && userFinancialStatisticsFound.getError()!.code == 500) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding financial statistics'));
        }

        let userFinancialStatistics: IUserFinancialStatistics;

        if (userFinancialStatisticsFound.isFailure && userFinancialStatisticsFound.getError()!.code == 404) {
            userFinancialStatistics = new UserFinancialStatisticsModel({
                user: userId,
                bonusSum: 0,
                purchaseSum: 0,
                refCount: 0,
                marketingSum: 0,
                usedPointsSum: 0,
                withdrawalSum: 0,
                managerPercentSum: 0,
                operations: [],
                purchases: []
            });

            const userFinancialStatisticsSaved = await this.userFinancialStatisticsRepo.save(userFinancialStatistics);
            if (userFinancialStatisticsSaved.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon saving user financial statistics'));
            }
        } else {
            userFinancialStatistics = userFinancialStatisticsFound.getValue()!; 
        }

        return Result.ok(userFinancialStatistics);
    }

    private calculateStatistics(fromTransactions: ITransaction[], toTransactions: ITransaction[], transactions: ITransaction[], refCount: number): Result<UpdateUserFinancialStatisticsDTO.IUserFinancialStatistics | null, UseCaseError | null> {
        const offerOperations: IUserFinancialOperation[] = toTransactions.filter(t => t.type == 'offer').map(t => {
            const sum = t.coupon?.price;

            return {
                sum: sum,
                timestamp: t.timestamp,
                type: 'purchase',
                bonusPoints: t.sum,
                couponName: t.coupon ? t.coupon.name : '',
                organizationName: t.organization ? t.organization.name : ''
            }
        });

        const refOperations: IUserFinancialOperation[] = toTransactions.filter(t => t.type == 'ref').map(t => {
            const transactionsInContext = transactions.filter(ct => ct.context == t.context);
            
            const refTransactions = transactionsInContext.filter(t => t.type == 'ref');

            const transactionSum = transactionsInContext.reduce((sum, cur) => sum += cur.sum, 0);

            const sum = t.coupon?.price || transactionSum || 0; 

            const isFirstLevel = (() => {
                let first = true;
                
                for (const rt of refTransactions) {
                    if (rt.sum > t.sum) {
                        first = false
                    }
                }

                return first;
            })();

            return {
                sum: sum,
                timestamp: t.timestamp,
                type: 'marketing',
                refPoints: t.sum,
                couponName: t.coupon ? t.coupon.name : '',
                organizationName: t.organization ? t.organization.name : '',
                level: isFirstLevel ? '1' : '2-21'
            };
        });

        const withdrawalOperations: IUserFinancialOperation[] = fromTransactions.filter(t => t.type == 'withdrawal').map(t => {
            return {
                sum: t.sum,
                timestamp: t.timestamp,
                type: 'withdrawal'
            };
        });

        const usedPointsOperations: IUserFinancialOperation[] = fromTransactions.filter(t => t.type == 'usedPoints' && t.sum > 0).map(t => {
            const transactionsInContext = fromTransactions.filter(ct => ct.context == t.context);
            
            const transaction = transactionsInContext.find(ct => ct.type == 'purchase' || ct.type == 'offer');

            const couponName = transaction?.coupon?.name || t.coupon?.name || '';
            
            return {
                sum: t.sum,
                timestamp: t.timestamp,
                type: 'usedPoints',
                organizationName: t.organization?.name || '',
                couponName: couponName || '' 
            };
        });

        const operations = withdrawalOperations.concat(offerOperations, refOperations, usedPointsOperations).sort((a, b) => a.timestamp < b.timestamp ? 1 : -1);
        
        const paymentTransactions = fromTransactions.filter(t => t.type == 'payment');
        const usedPointsTransactions = fromTransactions.filter(t => t.type == 'usedPoints');
        const managerPercentTransactions = toTransactions.filter(t => t.type == 'managerPercent');

        const purchaseSum = paymentTransactions.reduce((sum, cur) => sum += cur.sum, 0) + usedPointsTransactions.reduce((sum, cur) => sum += cur.sum, 0) 

        const bonusSum = offerOperations.reduce((sum, cur) => sum += cur.bonusPoints || 0, 0);

        const marketingSum = refOperations.reduce((sum, cur) => sum += cur.refPoints || 0, 0);

        const usedPointsSum = usedPointsTransactions.reduce((sum, cur) => sum += cur.sum, 0);

        const withdrawalSum = withdrawalOperations.reduce((sum, cur) => sum += cur.sum, 0);

        const managerPercentSum = managerPercentTransactions.reduce((sum, cur) => sum += cur.sum, 0);

        return Result.ok({
            bonusSum: Number(bonusSum.toFixed(2)),
            purchaseSum: Number(purchaseSum.toFixed(2)),
            operations: operations,
            refCount: refCount,
            purchases: new Array(paymentTransactions.length),
            marketingSum: Number(marketingSum.toFixed(2)),
            usedPointsSum: Number(usedPointsSum.toFixed(2)),
            withdrawalSum: Number(withdrawalSum.toFixed(2)),
            managerPercentSum: Number(managerPercentSum.toFixed(2))
        });
    }

    private async getKeyObjects(userId: string, dateFrom: Date): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        const userFound = await this.userRepo.findById(userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

        const walletFound = await this.walletRepo.findById(user.wallet.toHexString());
        if (walletFound.isFailure) {
            return Result.fail(walletFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding wallet') : UseCaseError.create('r'));
        }

        const wallet = walletFound.getValue()!;       

        const toTransactionsFound = await this.transactionRepo.findByTo(wallet._id.toString(), dateFrom);
        if (toTransactionsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding to transactions'));
        }

        const toTransactions = toTransactionsFound.getValue()!.filter(t => !t.disabled);

        const fromTransactionsFound = await this.transactionRepo.findByFrom(wallet._id.toString(), dateFrom);
        if (fromTransactionsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding from transactions'));
        }

        const fromTransactions = fromTransactionsFound.getValue()!.filter(t => !t.disabled);

        const contexts = fromTransactions.concat(toTransactions).map(t => t.context).filter(c => !!c);

        const contextDateFrom = new Date(dateFrom.getTime());

        contextDateFrom.setMinutes(dateFrom.getMinutes() - 2);

        const transactionsFound = await this.transactionRepo.findByContexts(contexts, contextDateFrom);
        if (transactionsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding transactions'));
        }

        const transactions = transactionsFound.getValue()!.filter(t => !t.disabled);

        const subscriptionsFound = await this.subscriptionRepo.findSubscriptionsByUser(user._id.toString());
        if (subscriptionsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding subscriptions'));
        }

        const subscriptions = subscriptionsFound.getValue()!;

        const subscriptionIds = subscriptions.map(s => s._id.toString());

        const refSubscriptionsCountFound = await this.subscriptionRepo.findByParentIdsCount(subscriptionIds);
        if (refSubscriptionsCountFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding ref subscriptions'));
        }

        const refSubscriptionsCount = refSubscriptionsCountFound.getValue()!;

        return Result.ok({
            fromTransactions,
            toTransactions,
            transactions,
            refCount: refSubscriptionsCount
        });
    }
}