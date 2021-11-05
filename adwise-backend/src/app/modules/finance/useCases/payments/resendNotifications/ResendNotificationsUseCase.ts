import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { IPaymentService } from "../../../../../services/paymentService/IPaymentService";
import { ResendNotificationsDTO } from "./ResendNotificationsDTO";
import { resendNotificationsErrors } from "./resendNotificationsErrors";

export class ResendNotificationsUseCase implements IUseCase<ResendNotificationsDTO.Request, ResendNotificationsDTO.Response> {
    private paymentService: IPaymentService;
    
    public errors = resendNotificationsErrors;

    constructor(paymentService: IPaymentService) {
        this.paymentService = paymentService;
    }

    public async execute(_: ResendNotificationsDTO.Request): Promise<ResendNotificationsDTO.Response> {
        const responses: any[] = [];

        let notificationsResent = await this.paymentService.resendNotifications('default');
        if (notificationsResent.isSuccess) {
            responses.push(notificationsResent.getValue());
        }

        notificationsResent = await this.paymentService.resendNotifications('safe');
        if (notificationsResent.isSuccess) {
            responses.push(notificationsResent.getValue());
        }

        notificationsResent = await this.paymentService.resendNotifications('split');
        if (notificationsResent.isSuccess) {
            responses.push(notificationsResent.getValue());
        }

        return Result.ok({responses});
    }
}