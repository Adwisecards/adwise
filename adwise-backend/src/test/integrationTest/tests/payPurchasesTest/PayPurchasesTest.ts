import { Result } from "../../../../app/core/models/Result";
import { UseCaseError } from "../../../../app/core/models/UseCaseError";
import { IPayment } from "../../../../app/modules/finance/models/Payment";
import { IPurchase } from "../../../../app/modules/finance/models/Purchase";
import { IPurchaseRepo } from "../../../../app/modules/finance/repo/purchases/IPurchaseRepo";
import { PayPurchaseUseCase } from "../../../../app/modules/finance/useCases/purchases/payPurchase/PayPurchaseUseCase";

interface IPayPurchasesObjects {
    purchases: IPurchase[];
    payments: IPayment[];
};

export class PayPurchasesTest {
    private purchaseRepo: IPurchaseRepo;
    private payPurchaseUseCase: PayPurchaseUseCase;

    constructor(
        purchaseRepo: IPurchaseRepo,
        payPurchaseUseCase: PayPurchaseUseCase
    ) {
        this.purchaseRepo = purchaseRepo;
        this.payPurchaseUseCase = payPurchaseUseCase;
    }

    public async execute(purchases: IPurchase[]): Promise<Result<IPayPurchasesObjects | null, UseCaseError | null>> {
        const payments: IPayment[] = [];
        const updatedPurchases: IPurchase[] = [];
        
        for (const purchase of purchases) {
            const purchasePaid = await this.payPurchaseUseCase.execute({
                purchaseId: purchase._id.toString(),
                usedPoints: 0,
                comment: 'comment'
            });

            if (purchasePaid.isFailure) {
                return Result.fail(purchasePaid.getError()!);
            }

            const { payment } = purchasePaid.getValue()!;

            const updatedPurchaseFound = await this.purchaseRepo.findById(purchase._id.toString());
            if (updatedPurchaseFound.isFailure) {
                return Result.fail(updatedPurchaseFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding purchase') : UseCaseError.create('s'));
            }

            const updatedPurchase = updatedPurchaseFound.getValue()!;

            payments.push(payment);
            updatedPurchases.push(updatedPurchase);
        }

        purchases = updatedPurchases;

        for (const index in payments) {
            const payment = payments[index];
            const purchase = purchases[index];
        
            if (!payment.ref) {
                return Result.fail(UseCaseError.create('c', 'Payment does not point to no purchase'));
            }

            if (payment.ref.toString() != purchase._id.toString()) {
                return Result.fail(UseCaseError.create('c', 'Payment pointing to incorrect purchase'));
            }

            if (payment.cash) {
                return Result.fail(UseCaseError.create('c', 'Payment type is cash'));
            }

            if (payment.split) {
                return Result.fail(UseCaseError.create('c', 'Payment type is split'));
            }

            if (payment.safe) {
                return Result.fail(UseCaseError.create('c', 'Payment type is safe'));
            }

            if (payment.paid) {
                return Result.fail(UseCaseError.create('c', 'Payment is paid'));
            }

            if (!purchase.payment) {
                return Result.fail(UseCaseError.create('c', 'Purchase does not point to no payment'));
            }

            if (purchase.payment.toString() != payment._id.toString()) {
                return Result.fail(UseCaseError.create('c', 'Purchase pointing to incorrect payment'));
            }

            if (Number(payment.sum) != Number(purchase.sumInPoints)) {
                return Result.fail(UseCaseError.create('c', 'Payment sum is not equal to purchase sum'));
            }

            if (!purchase.processing) {
                return Result.fail(UseCaseError.create('c', 'Purchase is not in process'));
            }
        }

        return Result.ok({payments, purchases});
    }
}