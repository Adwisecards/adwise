import { Result } from "../../../../app/core/models/Result";
import { UseCaseError } from "../../../../app/core/models/UseCaseError";
import { IGlobal } from "../../../../app/modules/administration/models/Global";
import { IPayment } from "../../../../app/modules/finance/models/Payment";
import { IPurchase } from "../../../../app/modules/finance/models/Purchase";
import { IPaymentRepo } from "../../../../app/modules/finance/repo/payments/IPaymentRepo";
import { IPurchaseRepo } from "../../../../app/modules/finance/repo/purchases/IPurchaseRepo";
import { ITransactionRepo } from "../../../../app/modules/finance/repo/transactions/ITransactionRepo";
import { HandlePaymentStatusDTO } from "../../../../app/modules/finance/useCases/payments/handlePaymentStatus/HandlePaymentStatusDTO";
import { HandlePaymentStatusUseCase } from "../../../../app/modules/finance/useCases/payments/handlePaymentStatus/HandlePaymentStatusUseCase";
import { CalculatePurchaseMarketingUseCase } from "../../../../app/modules/finance/useCases/purchases/calculatePurchaseMarketing/CalculatePurchaseMarketingUseCase";
import { IPaymentService } from "../../../../app/services/paymentService/IPaymentService";

interface IHandlePaymentStatusObjects {
    payments: IPayment[];
    purchases: IPurchase[];
};

interface ICheckPurchaseTransactionsObjects {
    purchase: IPurchase;
};

export class HandlePaymentStatusTest {
    private paymentRepo: IPaymentRepo;
    private purchaseRepo: IPurchaseRepo;
    private paymentService: IPaymentService;
    private transactionRepo: ITransactionRepo;
    private handlePaymentStatusUseCase: HandlePaymentStatusUseCase;
    private calculatePurchaseMarketingUseCase: CalculatePurchaseMarketingUseCase;

    constructor(
        paymentRepo: IPaymentRepo,
        purchaseRepo: IPurchaseRepo,
        paymentService: IPaymentService,
        transactionRepo: ITransactionRepo,
        handlePaymentStatusUseCase: HandlePaymentStatusUseCase,
        calculatePurchaseMarketingUseCase: CalculatePurchaseMarketingUseCase
    ) {
        this.paymentRepo = paymentRepo;
        this.purchaseRepo = purchaseRepo;
        this.paymentService = paymentService;
        this.transactionRepo = transactionRepo;
        this.handlePaymentStatusUseCase = handlePaymentStatusUseCase;
        this.calculatePurchaseMarketingUseCase = calculatePurchaseMarketingUseCase;
    }

    public async execute(purchases: IPurchase[], payments: IPayment[], global: IGlobal): Promise<Result<IHandlePaymentStatusObjects | null, UseCaseError | null>> {
        const updatedPayments: IPayment[] = [];
        const updatedPurchases: IPurchase[] = [];
        
        for (const payment of payments) {
            const handlePaymentData: HandlePaymentStatusDTO.Request = {
                SpAccumulationId: undefined as any,
                amount: {
                    value: payment.sum,
                    currency: 'rub'
                },
                event: this.paymentService.successfulStatus,
                ip: '0.0.0.0',
                metadata: {
                    id: payment._id.toString()
                },
                paid: true
            };

            const paymentStatusHandled = await this.handlePaymentStatusUseCase.execute(handlePaymentData);
            if (paymentStatusHandled.isFailure) {
                return Result.fail(paymentStatusHandled.getError());
            }

            const { success } = paymentStatusHandled.getValue()!;

            if (!success) {
                return Result.fail(UseCaseError.create('c', 'Payment hadnling is not successful'));
            }

            const updatedPaymentFound = await this.paymentRepo.findById(payment._id.toString());
            if (updatedPaymentFound.isFailure) {
                return Result.fail(updatedPaymentFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding purchase') : UseCaseError.create('4'));
            }

            const updatedPayment = updatedPaymentFound.getValue()!;

            const updatedPurchaseFound = await this.purchaseRepo.findById(updatedPayment.ref.toString());
            if (updatedPurchaseFound.isFailure) {
                return Result.fail(updatedPurchaseFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding purchase') : UseCaseError.create('s'));
            }

            const updatedPurchase = updatedPurchaseFound.getValue()!;

            updatedPurchases.push(updatedPurchase);
            updatedPayments.push(updatedPayment);
        }

        purchases = updatedPurchases;
        payments = updatedPayments;

        for (const index in payments) {
            const payment = payments[index];
            const purchase = purchases[index];

            if (!payment.paid) {
                return Result.fail(UseCaseError.create('c', 'Payment is not paid'));
            }

            if (purchase.processing) {
                return Result.fail(UseCaseError.create('c', 'Purchase is still in process'));
            }

            if (!purchase.confirmed) {
                return Result.fail(UseCaseError.create('c', 'purchase is not confirmed'));
            }

            if (purchase.complete) {
                return Result.fail(UseCaseError.create('c', 'Purchase is complete'));
            }

            if (!purchase.paidAt) {
                return Result.fail(UseCaseError.create('c', 'Purchase has no paidAt timestamp'));
            }

            const purchaseTransactionsChecked = await this.checkPurchaseTransactions(purchase, payment, global);
            if (purchaseTransactionsChecked.isFailure) {
                return Result.fail(purchaseTransactionsChecked.getError());
            }
        }

        return Result.ok({payments, purchases});
    }

    private async checkPurchaseTransactions(purchase: IPurchase, payment: IPayment, global: IGlobal): Promise<Result<ICheckPurchaseTransactionsObjects | null, UseCaseError | null>> {
        const { coupons, offers } = purchase;
        
        const transactionsFound = await this.transactionRepo.findByContexts([purchase._id.toString()]);
        if (transactionsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding transactions'));
        }

        const transactions = transactionsFound.getValue()!.filter(t => !t.disabled);

        if (!transactions.length) {
            return Result.fail(UseCaseError.create('c', 'No transactions in purchase context'));
        }
        
        const couponSum = coupons.reduce((sum, cur) => sum += cur.price, 0);
        
        let couponOfferSum = 0;
        let couponMaximumRefSum = 0;
        let couponTotalAdwiseSum = couponSum * (global.purchasePercent / 100);

        for (const index in coupons) {
            const coupon = coupons[index];
            const offer = offers[index];

            couponOfferSum += coupon.price * (offer.percent / 100);
            couponMaximumRefSum += coupon.price * (coupon.distributionSchema.first / 100);
            couponMaximumRefSum += coupon.price * ((coupon.distributionSchema.other * 20) / 100);
        }

        const usedPointsTransactionSum = transactions.filter(t => t.type == 'usedPoints').reduce((sum, cur) => sum += cur.sum, 0);
        const paymentTransactionSum = transactions.filter(t => t.type == 'payment').reduce((sum, cur) => sum += cur.sum, 0);
        const managerPercentTransactionSum = transactions.filter(t => t.type == 'managerPercent').reduce((sum, cur) => sum += cur.sum, 0);
        const adwiseTransactionSum = transactions.filter(t => t.type == 'adwise').reduce((sum, cur) => sum += cur.sum, 0);
        const paymentGatewayTransactionSum = transactions.filter(t => t.type == 'paymentGateway').reduce((sum, cur) => sum += cur.sum, 0);
        const offerTransactionSum = transactions.filter(t => t.type == 'offer').reduce((sum, cur) => sum += cur.sum, 0);
        const purchaseTransactionSum = transactions.filter(t => t.type == 'purchase').reduce((sum, cur) => sum += cur.sum, 0);
        const refTransactionSum = transactions.filter(t => t.type == 'ref').reduce((sum, cur) => sum += cur.sum, 0);

        const totalPaymentSum = usedPointsTransactionSum + paymentTransactionSum;
        const totalAdwiseSum = adwiseTransactionSum + managerPercentTransactionSum + paymentGatewayTransactionSum;

        // CHECKS

        if (couponSum != purchase.sumInPoints) {
            return Result.fail(UseCaseError.create('c', 'Purchase sum is not correct'));
        }

        if (totalPaymentSum != purchase.sumInPoints) {
            return Result.fail(UseCaseError.create('c', 'Total payment transaction sum is not correct'));
        }

        if (offerTransactionSum != couponOfferSum) {
            return Result.fail(UseCaseError.create('c', 'Offer transaction sum is not correct'));
        }

        if (refTransactionSum > couponMaximumRefSum) {
            return Result.fail(UseCaseError.create('c', 'Ref transaction sum is not correct'));
        }

        if (totalAdwiseSum != couponTotalAdwiseSum) {
            return Result.fail(UseCaseError.create('c', 'Total adwise transaction sum is not correct'));
        }

        if ((payment.cash && paymentGatewayTransactionSum > 0) || (!payment.cash && paymentGatewayTransactionSum == 0)) {
            return Result.fail(UseCaseError.create('c', 'Payment gateway transaction sum is not correct'));
        }

        const purchaseMarketingCalculated = await this.calculatePurchaseMarketingUseCase.execute({purchase});
        if (purchaseMarketingCalculated.isFailure) {
            return Result.fail(purchaseMarketingCalculated.getError());
        }

        const {
            adwiseSum,
            adwiseSumForCash,
            couponsWithMarketing,
            couponsWithOfferSum,
            managerSum,
            offerPayments,
            offerTotalSum,
            paymentGatewaySum,
            refPayments,
            refSum,
            totalSum,
            totalSumForCash
        } = purchaseMarketingCalculated.getValue()!;

        const organizationPoints = purchase.sumInPoints - totalSum;
        const organizationPointsForCash = purchase.sumInPoints - totalSumForCash;

        if ((payment.cash && purchaseTransactionSum != organizationPointsForCash) || (!payment.cash && purchaseTransactionSum != organizationPoints)) {
            return Result.fail(UseCaseError.create('c', 'Purchase points not correct'));
        }

        if (refSum != refTransactionSum) {
            return Result.fail(UseCaseError.create('c', 'Ref points not correct'));
        }

        if (offerTotalSum != offerTransactionSum) {
            return Result.fail(UseCaseError.create('c', 'Offer points not correct'));
        }

        if (managerSum != managerPercentTransactionSum) {
            return Result.fail(UseCaseError.create('c', 'Manager points not correct'));
        }

        if ((payment.cash && adwiseSumForCash != adwiseTransactionSum) || (!payment.cash && adwiseSum != adwiseTransactionSum)) {
            return Result.fail(UseCaseError.create('c', 'Adwise points not correct'));
        }

        const factualPurchaseTransactionSum = totalAdwiseSum + refTransactionSum + purchaseTransactionSum + offerTransactionSum;
        if (factualPurchaseTransactionSum != totalPaymentSum) {
            return Result.fail(UseCaseError.create('c', 'Transaction sum is not correct'));
        }

        return Result.ok({purchase});
    }
}