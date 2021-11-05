import c from "express-cluster";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IGlobal } from "../../../../administration/models/Global";
import { IGlobalRepo } from "../../../../administration/repo/globals/IGlobalRepo";
import { IOrganizationStatisticsService } from "../../../../organizations/services/organizations/organizationStatisticsService/IOrganizationStatisticsService";
import { IPayment } from "../../../models/Payment";
import { IPurchase } from "../../../models/Purchase";
import { ITransaction } from "../../../models/Transaction";
import { IPaymentRepo } from "../../../repo/payments/IPaymentRepo";
import { IPurchaseRepo } from "../../../repo/purchases/IPurchaseRepo";
import { ITransactionRepo } from "../../../repo/transactions/ITransactionRepo";
import { CalculatePurchaseMarketingUseCase } from "../calculatePurchaseMarketing/CalculatePurchaseMarketingUseCase";
import { ConfirmPurchaseUseCase } from "../confirmPurchase/ConfirmPurchaseUseCase";
import { FixIncorrectPurchasesDTO } from "./FixIncorrectPurchasesDTO";
import { fixIncorrectPurchasesErrors } from "./fixIncorrectPurchasesErrors";

interface IKeyObjects {
    global: IGlobal;
    payments: IPayment[];
    purchases: IPurchase[];
    transactions: ITransaction[];
};

export class FixIncorrectPurchasesUseCase implements IUseCase<FixIncorrectPurchasesDTO.Request, FixIncorrectPurchasesDTO.Response> {
    private globalRepo: IGlobalRepo;
    private paymentRepo: IPaymentRepo;
    private purchaseRepo: IPurchaseRepo;
    private transactionRepo: ITransactionRepo;
    private confirmPurchaseUseCase: ConfirmPurchaseUseCase;
    private organizationStatisticsService: IOrganizationStatisticsService;
    private calculatePurchaseMarketingUseCase: CalculatePurchaseMarketingUseCase;

    public errors = fixIncorrectPurchasesErrors;

    constructor(
        globalRepo: IGlobalRepo,
        paymentRepo: IPaymentRepo,
        purchaseRepo: IPurchaseRepo,
        transactionRepo: ITransactionRepo,
        confirmPurchaseUseCase: ConfirmPurchaseUseCase,
        organizationStatisticsService: IOrganizationStatisticsService,
        calculatePurchaseMarketingUseCase: CalculatePurchaseMarketingUseCase
    ) {
        this.globalRepo = globalRepo;
        this.paymentRepo = paymentRepo;
        this.purchaseRepo = purchaseRepo;
        this.transactionRepo = transactionRepo;
        this.confirmPurchaseUseCase = confirmPurchaseUseCase;
        this.organizationStatisticsService = organizationStatisticsService;
        this.calculatePurchaseMarketingUseCase = calculatePurchaseMarketingUseCase;
    }

    public async execute(req: FixIncorrectPurchasesDTO.Request): Promise<FixIncorrectPurchasesDTO.Response> {
        const keyObjectsGotten = await this.getKeyObjects(req.purchaseIds);
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError()!);
        }

        const {
            global,
            payments,
            purchases,
            transactions
        } = keyObjectsGotten.getValue()!;

        const purchaseIds: string[] = [];

        for (const purchase of purchases) {
            // await this.fixRef(purchase, transactions, payments);
            // await this.fixAdwise(purchase, transactions, global);
            // await this.fixOffer(purchase, transactions, payments);
            // await this.fixPurchase(purchase, transactions, payments);

            await this.reconfirmPurchase(purchase, transactions, payments);
        }

        return Result.ok({
            purchaseIds
        });
    }

    private async reconfirmPurchase(purchase: IPurchase, transactions: ITransaction[], payments: IPayment[]): Promise<Result<string | null, UseCaseError | null>> {
        // if (purchase.coupons.length == 1) {
        //     return Result.ok('');
        // }
        
        const transactionsInContext = transactions.filter(t => t.context?.toString() == purchase._id.toString() && t.type != 'usedPoints' && t.type != 'payment' && t.type != 'correct');

        const transactionIds = transactionsInContext.map(t => t._id.toString());

        const payment = payments.find(p => p.ref.toString() == purchase._id.toString());

        const correctTransaction = transactionsInContext.find(t => t.type == 'correct');

        if (!payment) {
            return Result.ok('');
        }

        const transactionsDisabled = await this.transactionRepo.setManyDisabledByIds(transactionIds, true);
        if (transactionsDisabled.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon deleting transactions'));
        }

        const purchaseConfirmed = await this.confirmPurchaseUseCase.execute({
            purchaseId: purchase._id.toString(),
            cash: payment.cash,
            safe: payment.safe,
            split: payment.split
        });

        if (purchaseConfirmed.isFailure) {
            await this.transactionRepo.setManyDisabledByIds(transactionIds, false);
            return Result.fail(UseCaseError.create('a', 'Error upon confirming purchase'));
        }

        const newTransactionsInContextFound = await this.transactionRepo.findByContexts([purchase._id.toString()]);
        if (newTransactionsInContextFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding purchase transaction'));
        }

        const newTransactionsInContext = newTransactionsInContextFound.getValue()!.filter(t => !t.disabled);
        
        const purchaseTransactions = newTransactionsInContext.filter(t => t.type == 'purchase');

        const purchaseTransactionSum = purchaseTransactions.reduce((sum, cur) => sum += cur.sum, 0);

        if (correctTransaction) {
            if (purchaseTransactionSum != correctTransaction.sum) {
                correctTransaction.sum = purchaseTransactionSum;
                
                const correctTransactionSaved = await this.transactionRepo.save(correctTransaction);
                if (correctTransactionSaved.isFailure) {
                    return Result.fail(UseCaseError.create('a', 'Error upon saving correct transaction'));
                }
            }
        }

        const paymentTransaction = newTransactionsInContext.find(t => t.type == 'payment');

        for (const transaction of newTransactionsInContext) {
            transaction.timestamp = paymentTransaction?.timestamp || purchase.paidAt || transaction.timestamp;

            const transactionSaved = await this.transactionRepo.save(transaction);
            if (transactionSaved.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon saving transaction'));
            }
        }

        return Result.ok('');
    }

    private async fixRef(purchase: IPurchase, transactions: ITransaction[], payments: IPayment[]): Promise<Result<string | null, UseCaseError | null>> {
        const transactionsInContext = transactions.filter(t => t.context?.toString() == purchase._id.toString());

        const refTransactions = transactionsInContext.filter(t => t.type == 'ref');
        const payment = payments.find(p => p.ref.toString() == purchase._id.toString());

        if (!transactionsInContext.length || !refTransactions.length || !payment) {
            return Result.ok('');
        }

        const purchaseMarketingCalculated = await this.calculatePurchaseMarketingUseCase.execute({
            purchase: purchase
        });

        if (purchaseMarketingCalculated.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon calculating purchase marketing'));
        }

        const {
            couponsWithMarketing,
            refPayments,
            refSum
        } = purchaseMarketingCalculated.getValue()!;

        console.log('refPayments', refPayments.map(rp => rp.sum), refSum, couponsWithMarketing.map(c => c.refSum));

        const origin = payment.cash ? 'cash' : (payment.safe ? 'safe' : (payment.split ? 'split' : 'online'));
        
        for (const refPayment of refPayments) {
            refPayment.subscription.subscriber

            console.log(refPayments[0]?.index);

            const couponRefTransaction = refTransactions.find(t => refPayment.coupon._id.toString() == t.coupon?._id.toString());
            if (!couponRefTransaction) {
                return Result.ok('');
            }

            const presumedRefPoints = Math.round(refPayment.sum * 100) / 100;
            const factualRefPoints = Math.round((couponRefTransaction!.sum) * 100) / 100;

            const difference = Math.round((presumedRefPoints - factualRefPoints) * 100) / 100;

            console.log(presumedRefPoints, factualRefPoints, difference);

            if (difference) {
                couponRefTransaction.sum += difference;
                
                const couponRefTransactionSaved = await this.transactionRepo.save(couponRefTransaction);
                if (couponRefTransactionSaved.isFailure) {
                    return Result.fail(UseCaseError.create('a', 'Error upon saving coupon offer transaction'));
                }

                return Result.ok('');
            }
        }

        return Result.ok('');
    }

    private async fixOffer(purchase: IPurchase, transactions: ITransaction[], payments: IPayment[]): Promise<Result<string | null, UseCaseError | null>> {
        const transactionsInContext = transactions.filter(t => t.context?.toString() == purchase._id.toString());

        const offerTransactions = transactionsInContext.filter(t => t.type == 'offer');
        const payment = payments.find(p => p.ref.toString() == purchase._id.toString());

        if (!transactionsInContext.length || !offerTransactions.length || !payment) {
            return Result.ok('');
        }

        const purchaseMarketingCalculated = await this.calculatePurchaseMarketingUseCase.execute({
            purchase: purchase
        });

        if (purchaseMarketingCalculated.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon calculating purchase marketing'));
        }

        const {
            couponsWithMarketing
        } = purchaseMarketingCalculated.getValue()!;

        const origin = payment.cash ? 'cash' : (payment.safe ? 'safe' : (payment.split ? 'split' : 'online'));

        for (const coupon of couponsWithMarketing) {
            const couponOfferTransaction = offerTransactions.find(t => coupon.coupon._id.toString() == t.coupon?._id.toString());
            if (!couponOfferTransaction) {
                return Result.ok('');
            }

            const presumedOfferPoints = Math.round(coupon.offerSum * 100) / 100;
            const factualOfferPoints = Math.round((couponOfferTransaction!.sum) * 100) / 100;

            const difference = Math.round((presumedOfferPoints - factualOfferPoints) * 100) / 100;

            console.log(presumedOfferPoints, factualOfferPoints, difference);

            if (difference) {
                couponOfferTransaction.sum += difference;
                
                const couponOfferTransactionSaved = await this.transactionRepo.save(couponOfferTransaction);
                if (couponOfferTransactionSaved.isFailure) {
                    return Result.fail(UseCaseError.create('a', 'Error upon saving coupon offer transaction'));
                }

                return Result.ok('');
            }
        }

        return Result.ok('');
    }

    private async fixPurchase(purchase: IPurchase, transactions: ITransaction[], payments: IPayment[]): Promise<Result<string | null, UseCaseError | null>> {
        const transactionsInContext = transactions.filter(t => t.context?.toString() == purchase._id.toString());

        const purchaseTransactions = transactionsInContext.filter(t => t.type == 'purchase');
        const payment = payments.find(p => p.ref.toString() == purchase._id.toString());

        if (!transactionsInContext.length || !purchaseTransactions.length || !payment) {
            return Result.ok('');
        }

        const purchaseMarketingCalculated = await this.calculatePurchaseMarketingUseCase.execute({
            purchase: purchase
        });

        if (purchaseMarketingCalculated.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon calculating purchase marketing'));
        }

        const {
            couponsWithMarketing
        } = purchaseMarketingCalculated.getValue()!;

        const origin = payment.cash ? 'cash' : (payment.safe ? 'safe' : (payment.split ? 'split' : 'online'));

        for (const coupon of couponsWithMarketing) {
            const couponPurchaseTransaction = purchaseTransactions.find(t => coupon.coupon._id.toString() == t.coupon?._id.toString());
            if (!couponPurchaseTransaction) {
                return Result.ok('');
            }

            const presumedOrganizationPoints = Math.round((coupon.coupon.price - (origin == 'cash' ? coupon.totalSumForCash : coupon.totalSum)) * 100) / 100;
            const factualOrganizationPoints = Math.round((couponPurchaseTransaction!.sum) * 100) / 100;

            const difference = Math.round((presumedOrganizationPoints - factualOrganizationPoints) * 100) / 100;

            console.log(presumedOrganizationPoints, factualOrganizationPoints, difference);

            if (difference) {
                couponPurchaseTransaction.sum += difference;
                
                const couponPurchaseTransactionSaved = await this.transactionRepo.save(couponPurchaseTransaction);
                if (couponPurchaseTransactionSaved.isFailure) {
                    return Result.fail(UseCaseError.create('a', 'Error upon saving coupon purchase transaction'));
                }

                return Result.ok('');
            }
        }

        return Result.ok('');
    }

    private async fixAdwise(purchase: IPurchase, transactions: ITransaction[], global: IGlobal): Promise<Result<string | null, UseCaseError | null>> {
        const transactionsInContext = transactions.filter(t => t.context?.toString() == purchase._id.toString());

        const adwiseTransaction = transactionsInContext.find(t => t.type == 'adwise');

        if (!transactionsInContext.length || !adwiseTransaction) {
            return Result.ok('');
        }

        const purchaseWithStatsGotten = await this.organizationStatisticsService.getPurchasesWithStats([purchase]);
        if (purchaseWithStatsGotten.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting purchase with stats'));
        }

        const purchaseWithStats = purchaseWithStatsGotten.getValue()![0];

        if (!purchaseWithStats) {
            return Result.fail(UseCaseError.create('a', 'Cannot get purchase with stats'));
        }

        const {managerPoints, adwisePoints, paymentGatewayPoints} = purchaseWithStats.stats;

        const presumedAdwisePoints = Math.round((purchase.sumInPoints * (global.purchasePercent / 100) * 100)) / 100;

        const factualAdwisePoints = Math.round((managerPoints + adwisePoints + paymentGatewayPoints) * 100) / 100;

        const difference = Math.round((presumedAdwisePoints - factualAdwisePoints) * 100) / 100;

        if (difference > 0) {
            console.log(difference);
            adwiseTransaction.sum += difference;
            const adwiseTransactionSaved = await this.transactionRepo.save(adwiseTransaction);
            if (adwiseTransactionSaved.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon saving adwise transaction'));
            }

            return Result.ok(purchase._id.toString());    
        }

        return Result.ok('');
    }

    private async getKeyObjects(purchaseIds: string[]): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        const globalGotten = await this.globalRepo.getGlobal();
        if (globalGotten.isFailure) {
            console.log(globalGotten.getError());
            return Result.fail(UseCaseError.create('a', 'Error upon getting global'));
        }

        const global = globalGotten.getValue()!;

        let purchases: IPurchase[] = [];
        
        if (purchaseIds?.length) {
            const purchasesFound = await this.purchaseRepo.findByIds(purchaseIds);
            if (purchasesFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding purchases'));
            }

            purchases = purchasesFound.getValue()!.filter(p => p.confirmed);
        } else {
            const purchasesFound = await this.purchaseRepo.getAll();
            if (purchasesFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding purchases'));
            }

            purchases = purchasesFound.getValue()!.filter(p => p.confirmed);
        }

        const contexts = purchases.map(p => p._id.toString());

        const transactionsFound = await this.transactionRepo.findByContexts(contexts);
        if (transactionsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding transactions'));
        }

        const transactions = transactionsFound.getValue()!.filter(t => !t.disabled);

        const paymentIds = purchases.filter(p => p.payment).map(p => p.payment.toString());

        const paymentsFound = await this.paymentRepo.findByIds(paymentIds);
        if (paymentsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding payments'));
        }

        const payments = paymentsFound.getValue()!;

        return Result.ok({
            purchases,
            payments,
            transactions,
            global
        });
    }
}