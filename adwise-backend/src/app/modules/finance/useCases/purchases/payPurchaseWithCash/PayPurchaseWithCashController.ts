import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { PayPurchaseWithCashDTO } from "./PayPurchaseWithCashDTO";

export class PayPurchaseWithCashController extends HTTPController<PayPurchaseWithCashDTO.Request, PayPurchaseWithCashDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: PayPurchaseWithCashDTO.Request = {
            purchaseId: req.params.id,
            usedPoints: req.body.usedPoints,
            comment: req.body.comment
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