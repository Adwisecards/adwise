import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { SendTipsDTO } from "./SendTipsDTO";

export class SendTipsController extends HTTPController<SendTipsDTO.Request, SendTipsDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: SendTipsDTO.Request = {
            cashierUserId: req.body.cashierUserId,
            sum: req.body.sum,
            userId: req.decoded?.userId,
            purchaseId: req.body.purchaseId
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