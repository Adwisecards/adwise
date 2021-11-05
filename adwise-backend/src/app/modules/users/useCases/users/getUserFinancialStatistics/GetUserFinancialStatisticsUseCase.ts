import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ISubscription } from "../../../../finance/models/Subscription";
import { ITransaction } from "../../../../finance/models/Transaction";
import { IWallet } from "../../../../finance/models/Wallet";
import { purchaseRepo } from "../../../../finance/repo/purchases";
import { IPurchaseRepo } from "../../../../finance/repo/purchases/IPurchaseRepo";
import { ISubscriptionRepo } from "../../../../finance/repo/subscriptions/ISubscriptionRepo";
import { ITransactionRepo } from "../../../../finance/repo/transactions/ITransactionRepo";
import { IWalletRepo } from "../../../../finance/repo/wallets/IWalletRepo";
import { IUser } from "../../../models/User";
import { IUserRepo } from "../../../repo/users/IUserRepo";
import { GetUserFinancialStatisticsDTO } from "./GetUserFinancialStatisticsDTO";
import { getUserFinancialStatisticsErrors } from "./getUserFinancialStatisticsErrors";

interface IKeyObjects {
    user: IUser;
    wallet: IWallet;
    toTransactions: ITransaction[];
    fromTransactions: ITransaction[];
    transactions: ITransaction[];
    refCount: number;
};

export class GetUserFinancialStatisticsUseCase implements IUseCase<GetUserFinancialStatisticsDTO.Request, GetUserFinancialStatisticsDTO.Response> {
    private walletRepo: IWalletRepo;
    private userRepo: IUserRepo;
    private transactionRepo: ITransactionRepo;
    private subscriptionRepo: ISubscriptionRepo;

    public errors = [
        ...getUserFinancialStatisticsErrors
    ];

    constructor(walletRepo: IWalletRepo, userRepo: IUserRepo, transactionRepo: ITransactionRepo, subscriptionRepo: ISubscriptionRepo) {
        this.walletRepo = walletRepo;
        this.userRepo = userRepo;
        this.transactionRepo = transactionRepo;
        this.subscriptionRepo = subscriptionRepo;
    }

    public async execute(req: GetUserFinancialStatisticsDTO.Request): Promise<GetUserFinancialStatisticsDTO.Response> {
        if (!Types.ObjectId.isValid(req.userId)) {
            return Result.fail(UseCaseError.create('c', 'userId is not valid'));
        }

        const keyObjectsGotten = await this.getKeyObjects(req.userId);
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError()!);
        }

        const {
            fromTransactions,
            toTransactions,
            user,
            wallet,
            transactions,
            refCount
        } = keyObjectsGotten.getValue()!;
        
        wallet.points += wallet.cashbackPoints + wallet.bonusPoints; // TEMP
        wallet.cashbackPoints = 0;
        wallet.bonusPoints = 0;

        const offerOperations: GetUserFinancialStatisticsDTO.IOperation[] = toTransactions.filter(t => t.type == 'offer').map(t => {
            const sum = t.coupon?.price;

            return {
                sum: sum,
                timestamp: t.timestamp,
                type: 'purchase',
                bonusPoints: t.sum,
                couponName: t.coupon ? t.coupon.name : '',
                organizationName: t.organization ? t.organization.name : ''
            };
        });

        const refOperations: GetUserFinancialStatisticsDTO.IOperation[] = toTransactions.filter(t => t.type == 'ref').map(t => {
            const transactionsInContext = transactions.filter(ct => ct.context == t.context);
            
            const refTransactions = transactionsInContext.filter(t => t.type == 'ref');

            const sum = t.coupon?.price; 

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

        const withdrawalOperations: GetUserFinancialStatisticsDTO.IOperation[] = fromTransactions.filter(t => t.type == 'withdrawal').map(t => {
            return {
                sum: t.sum,
                timestamp: t.timestamp,
                type: 'withdrawal'
            }
        });

        const operations = withdrawalOperations.concat(offerOperations, refOperations).sort((a, b) => a.timestamp < b.timestamp ? 1 : -1);
        
        const paymentTransactions = fromTransactions.filter(t => t.type == 'payment');
        const usedPointsTransactions = fromTransactions.filter(t => t.type == 'usedPoints');

        const purchaseSum = paymentTransactions.reduce((sum, cur) => sum += cur.sum, 0) + usedPointsTransactions.reduce((sum, cur) => sum += cur.sum, 0) 

        const bonusSum = offerOperations.reduce((sum, cur) => sum += cur.bonusPoints || 0, 0);

        const marketingSum = refOperations.reduce((sum, cur) => sum += cur.refPoints || 0, 0)

        return Result.ok({
            wallet: wallet,
            bonusSum: Number(bonusSum.toFixed(2)),
            purchaseSum: Number(purchaseSum.toFixed(2)),
            operations: operations,
            refCount: refCount,
            purchases: new Array(paymentTransactions.length),
            marketingSum: Number(marketingSum.toFixed(2))
        });
    }

    private async getKeyObjects(userId: string): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
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

        const toTransactionsFound = await this.transactionRepo.findByTo(wallet._id.toString());
        if (toTransactionsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding to transactions'));
        }

        const toTransactions = toTransactionsFound.getValue()!;

        const fromTransactionsFound = await this.transactionRepo.findByFrom(wallet._id.toString());
        if (fromTransactionsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding from transactions'));
        }

        const fromTransactions = fromTransactionsFound.getValue()!;

        const contexts = fromTransactions.concat(toTransactions).map(t => t.context);

        const transactionsFound = await this.transactionRepo.findByContexts(contexts);
        if (transactionsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding transactions'));
        }

        const transactions = transactionsFound.getValue()!;

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
            user,
            wallet,
            transactions,
            refCount: refSubscriptionsCount
        });
    }
}