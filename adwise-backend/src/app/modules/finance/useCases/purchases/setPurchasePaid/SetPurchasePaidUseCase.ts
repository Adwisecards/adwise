import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { paymentService } from "../../../../../services/paymentService";
import { IPaymentService } from "../../../../../services/paymentService/IPaymentService";
import { IPayment } from "../../../models/Payment";
import { IPurchase } from "../../../models/Purchase";
import { IPaymentRepo } from "../../../repo/payments/IPaymentRepo";
import { IPurchaseRepo } from "../../../repo/purchases/IPurchaseRepo";
import { CreatePaymentUseCase } from "../../payments/createPayment/CreatePaymentUseCase";
import { HandlePaymentStatusUseCase } from "../../payments/handlePaymentStatus/HandlePaymentStatusUseCase";
import { DisableTransactionsWithContextUseCase } from "../../transactions/disableTransactionsWithContext/DisableTransactionsWithContextUseCase";
import { SetPurchasePaidDTO } from "./SetPurchasePaidDTO";
import { setPurchasePaidErrors } from "./setPurchasePaidErrors";

interface IKeyObjects {
    purchase: IPurchase;
    payment: IPayment;
};

export class SetPurchasePaidUseCase implements IUseCase<SetPurchasePaidDTO.Request, SetPurchasePaidDTO.Response> {
    private paymentRepo: IPaymentRepo;
    private purchaseRepo: IPurchaseRepo;
    private paymentService: IPaymentService;
    private createPaymentUseCase: CreatePaymentUseCase;
    private handlePaymentStatusUseCase: HandlePaymentStatusUseCase;
    private disableTransactionsWithContextUseCase: DisableTransactionsWithContextUseCase;

    public errors = setPurchasePaidErrors;

    constructor(
        paymentRepo: IPaymentRepo,
        purchaseRepo: IPurchaseRepo,
        paymentService: IPaymentService,
        createPaymentUseCase: CreatePaymentUseCase,
        handlePaymentStatusUseCase: HandlePaymentStatusUseCase,
        disableTransactionsWithContextUseCase: DisableTransactionsWithContextUseCase
    ) {
        this.paymentRepo = paymentRepo;
        this.purchaseRepo = purchaseRepo;
        this.paymentService = paymentService;
        this.createPaymentUseCase = createPaymentUseCase;
        this.handlePaymentStatusUseCase = handlePaymentStatusUseCase;
        this.disableTransactionsWithContextUseCase = disableTransactionsWithContextUseCase;
    }

    public async execute(req: SetPurchasePaidDTO.Request): Promise<SetPurchasePaidDTO.Response> {
        if (!Types.ObjectId.isValid(req.purchaseId)) {
            return Result.fail(UseCaseError.create('c', 'purchaseId is not valid'));
        }

        const keyObjectsGotten = await this.getKeyObjects(req.purchaseId);
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError()!);
        }

        const {
            payment,
            purchase
        } = keyObjectsGotten.getValue()!;

        if (purchase.canceled) {
            return Result.fail(UseCaseError.create('c', 'Purchase is canceled'));
        }

        purchase.confirmed = false;
        purchase.complete = false;

        const transactionsDisabled = await this.disableTransactionsWithContextUseCase.execute({
            context: purchase._id.toString()
        });

        if (transactionsDisabled.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon disabling purchase transactions'));
        }

        const purchaseSaved = await this.purchaseRepo.save(purchase);
        if (purchaseSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving purchase'));
        }

        payment.paid = false;
        payment.confirmed = false;
        payment.split = false;
        payment.safe = false;

        const paymentSaved = await this.paymentRepo.save(payment);
        if (paymentSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving payment'));
        }

        const paymentStatusHandled = await this.handlePaymentStatusUseCase.execute({
            SpAccumulationId: undefined as any,
            amount: {
                currency: 'rub',
                value: payment.sum
            },
            event: paymentService.successfulStatus,
            ip: '',
            metadata: {
                id: payment._id.toString()
            },
            paid: true
        });

        if (paymentStatusHandled.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon handling payment status'));
        }

        return Result.ok({purchaseId: req.purchaseId});
    }

    private async getKeyObjects(purchaseId: string): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        const purchaseFound = await this.purchaseRepo.findById(purchaseId);
        if (purchaseFound.isFailure) {
            return Result.fail(purchaseFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding purchase') : UseCaseError.create('s'));
        }

        const purchase = purchaseFound.getValue()!;

        let payment: IPayment;

        if (purchase.payment) {
            const paymentFound = await this.paymentRepo.findById(purchase.payment.toString());
            if (paymentFound.isFailure) {
                return Result.fail(paymentFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding payment') : UseCaseError.create('4'));
            }

            payment = paymentFound.getValue()!;
        } else {
            const paymentCreated = await this.createPaymentUseCase.execute({
                currency: 'rub',
                ref: purchase._id.toString(),
                shopId: '',
                sum: Number(purchase.sumInPoints),
                type: 'purchase',
                usedPoints: 0,
                safe: false
            });

            if (paymentCreated.isFailure) {
                console.log(paymentCreated.getError());
                return Result.fail(UseCaseError.create('a', 'Error upon creating payment'));
            }

            payment = paymentCreated.getValue()!.payment;
        }

        return Result.ok({
            payment,
            purchase
        });
    }
}