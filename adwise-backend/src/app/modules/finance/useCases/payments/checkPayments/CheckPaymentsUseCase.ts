import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IPaymentRepo } from "../../../repo/payments/IPaymentRepo";
import { ForciblyHandlePaymentStatusUseCase } from "../forciblyHandlePaymentStatus/ForciblyHandlePaymentStatusUseCase";
import { CheckPaymentsDTO } from "./CheckPaymentsDTO";
import { checkPaymentsErrors } from "./checkPaymentsErrors";

export class CheckPaymentsUseCase implements IUseCase<CheckPaymentsDTO.Request, CheckPaymentsDTO.Response> {
    private paymentRepo: IPaymentRepo;
    private forciblyHandlePaymentStatusUseCase: ForciblyHandlePaymentStatusUseCase;

    public errors = checkPaymentsErrors;

    constructor(paymentRepo: IPaymentRepo, forciblyHandlePaymentStatusUseCase: ForciblyHandlePaymentStatusUseCase) {
        this.paymentRepo = paymentRepo;
        this.forciblyHandlePaymentStatusUseCase = forciblyHandlePaymentStatusUseCase;
    }

    public async execute(_: CheckPaymentsDTO.Request): Promise<CheckPaymentsDTO.Response> {
        const paymentsGotten = await this.paymentRepo.getAll();
        if (paymentsGotten.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting payments'));
        }

        const date = new Date();

        date.setDate(date.getDate()-7);

        const payments = paymentsGotten.getValue()!.filter(p => {
            const timestamp = new Types.ObjectId(p._id.toString()).getTimestamp();

            return !p.paid && timestamp.getTime() > date.getTime() && p.paymentId;
        });

        const paymentIds: string[] = [];

        for (const payment of payments) {
            const paymentStatusForciblyHandled = await this.forciblyHandlePaymentStatusUseCase.execute({
                paymentId: payment._id
            });

            if (paymentStatusForciblyHandled.isSuccess) {
                paymentIds.push(payment._id);
            }
        }

        return Result.ok({paymentIds});
    }
}