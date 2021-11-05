import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { ConfirmCashPaymentDTO } from "./ConfirmCashPaymentDTO";

export class ConfirmCashPaymentController extends HTTPController<ConfirmCashPaymentDTO.Request, ConfirmCashPaymentDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: ConfirmCashPaymentDTO.Request = {
            paymentId: req.params.id
        };

        const result = await this.useCase.execute(dto);
        if (result.isFailure) {
            return this.handleError(res, result.getError()!);
        }

        const data = result.getValue()!;
        this.success(res, {data}, {
            cookies: [],
            headers: []
        });
    }
}