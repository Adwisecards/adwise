import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IPayment } from "../../../models/Payment";
import { IPurchase } from "../../../models/Purchase";
import { paymentRepo } from "../../../repo/payments";
import { IPaymentRepo } from "../../../repo/payments/IPaymentRepo";
import { IPurchaseRepo } from "../../../repo/purchases/IPurchaseRepo";
import { BindPaymentsToPurchasesDTO } from "./BindPaymentsToPurchasesDTO";
import { bindPaymentsToPurchasesErrors } from "./bindPaymentsToPurchasesErrors";

interface IKeyObjects {
    purchases: IPurchase[];
    payments: IPayment[];
};

export class BindPaymentsToPurchasesUseCase implements IUseCase<BindPaymentsToPurchasesDTO.Request, BindPaymentsToPurchasesDTO.Response> {
    private paymentRepo: IPaymentRepo;
    private purchaseRepo: IPurchaseRepo;

    public errors = bindPaymentsToPurchasesErrors;

    constructor(
        paymentRepo: IPaymentRepo,
        purchaseRepo: IPurchaseRepo
    ) {
        this.paymentRepo = paymentRepo;
        this.purchaseRepo = purchaseRepo;
    }

    public async execute(_: BindPaymentsToPurchasesDTO.Request): Promise<BindPaymentsToPurchasesDTO.Response> {
        const keyObjectsGotten = await this.getKeyObjects();
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError()!);
        }

        const {
            payments,
            purchases
        } = keyObjectsGotten.getValue()!;

        const purchaseIds: string[] = [];

        for (const purchase of purchases) {
            const result = await this.bindPaymentToPurchase(purchase, payments);
            if (result.isFailure) {
                continue;
            }

            const id = result.getValue()!;

            purchaseIds.push(id);
        }

        return Result.ok({purchaseIds});
    }

    private async bindPaymentToPurchase(purchase: IPurchase, payments: IPayment[]): Promise<Result<string | null, UseCaseError | null>> {
        const payment = payments.find(p => p.ref.toString() == purchase._id.toString());

        if (!payment) {
            return Result.fail(UseCaseError.create('b', 'Payment does not exist'));
        }

        purchase.payment = payment._id.toString();

        const purchaseSaved = await this.purchaseRepo.save(purchase);
        if (purchaseSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving purchase'));
        }

        return Result.ok(purchase._id.toString());
    }

    private async getKeyObjects(): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        const purchasesFound = await this.purchaseRepo.getAll();
        if (purchasesFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding purchases'));
        }

        const purchases = purchasesFound.getValue()!.filter(p => p.confirmed && !p.payment);

        const purchaseIds = purchases.map(p => p._id.toString());

        const paymentsFound = await paymentRepo.findManyByRefsAndPaid(purchaseIds, true);
        if (paymentsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding payments'));
        }

        const payments = paymentsFound.getValue()!;

        return Result.ok({payments, purchases});
    }
}