import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IPaymentService } from "../../../../../services/paymentService/IPaymentService";
import { IPaymentRepo } from "../../../repo/payments/IPaymentRepo";
import { HandlePaymentStatusUseCase } from "../handlePaymentStatus/HandlePaymentStatusUseCase";
import { ForciblyHandlePaymentStatusDTO } from "./ForciblyHandlePaymentStatusDTO";
import { forciblyHandlePaymentStatusErrors } from "./forciblyHandlePaymentStatusErrors";

export class ForciblyHandlePaymentStatusUseCase implements IUseCase<ForciblyHandlePaymentStatusDTO.Request, ForciblyHandlePaymentStatusDTO.Response> {
    private paymentRepo: IPaymentRepo;
    private paymentService: IPaymentService;
    private handlePaymentStatus: HandlePaymentStatusUseCase;

    public errors = forciblyHandlePaymentStatusErrors;

    constructor(paymentRepo: IPaymentRepo, paymentService: IPaymentService, handlePaymentStatus: HandlePaymentStatusUseCase) {
        this.paymentRepo = paymentRepo;
        this.paymentService = paymentService;
        this.handlePaymentStatus = handlePaymentStatus;
    }

    public async execute(req: ForciblyHandlePaymentStatusDTO.Request): Promise<ForciblyHandlePaymentStatusDTO.Response> {
        if (!Types.ObjectId.isValid(req.paymentId)) {
            return Result.fail(UseCaseError.create('c', 'paymentId is not valid'));
        }

        const paymentFound = await this.paymentRepo.findById(req.paymentId);
        if (paymentFound.isFailure) {
            return Result.fail(paymentFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding payment') : UseCaseError.create('4'));
        }

        const payment = paymentFound.getValue()!;

        if (payment.paid) {
            return Result.fail(UseCaseError.create('c', 'Payment is already paid'));
        }

        if (!payment.paymentId) {
            return Result.fail(UseCaseError.create('c', 'Payment does not have payment id'));
        }

        const type = payment.split ? 'split' : (payment.safe ? 'safe' : 'default');

        const paymentConfirmedChecked = await this.paymentService.checkPaymentConfirmed(payment.paymentId, type);
        if (paymentConfirmedChecked.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon checking payment confirmed'));
        }

        const paymentConfirmed = paymentConfirmedChecked.getValue()!;

        if (!paymentConfirmed) {
            return Result.fail(UseCaseError.create('c', 'Payment is not confirmed yet'));
        }

        const paymentStatusHandled = await this.handlePaymentStatus.execute({
            SpAccumulationId: undefined as any,
            amount: {
                currency: 'rub',
                value: payment.sum
            },
            event: this.paymentService.successfulStatus,
            ip: '',
            metadata: {
                id: payment._id.toString()
            },
            paid: true
        });

        if (paymentStatusHandled.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon handling payment status'));
        }

        return Result.ok({paymentId: req.paymentId});
    }
}