import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { PaymentModel } from "../../../models/Payment";
import { IPaymentRepo } from "../../../repo/payments/IPaymentRepo";
import { IPurchaseRepo } from "../../../repo/purchases/IPurchaseRepo";
import { IPaymentValidationService } from "../../../services/payments/paymentValidationService/IPaymentValidationService";
import { CreateCashPaymentDTO } from "./CreateCashPaymentDTO";
import { createCashPaymentErrors } from "./createCashPaymentErrors";

export class CreateCashPaymentUseCase implements IUseCase<CreateCashPaymentDTO.Request, CreateCashPaymentDTO.Response> {
    private paymentRepo: IPaymentRepo;
    private paymentValidationService: IPaymentValidationService;
    private purchaseRepo: IPurchaseRepo
    ;
    public errors = [
        ...createCashPaymentErrors
    ];

    constructor(paymentRepo: IPaymentRepo, paymentValidationService: IPaymentValidationService, purchaseRepo: IPurchaseRepo) {
        this.paymentRepo = paymentRepo;
        this.paymentValidationService = paymentValidationService;
        this.purchaseRepo = purchaseRepo;
    }

    public async execute(req: CreateCashPaymentDTO.Request): Promise<CreateCashPaymentDTO.Response> {
        const valid = this.paymentValidationService.createPaymentData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const payment = new PaymentModel({
            ref: req.ref,
            currency: req.currency,
            sum: req.sum,
            type: req.type,
            usedPoints: req.usedPoints,
            cash: true
        });

        const paymentSaved = await this.paymentRepo.save(payment);
        if (paymentSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving payment'));
        }

        return Result.ok({payment: payment});
    }
}