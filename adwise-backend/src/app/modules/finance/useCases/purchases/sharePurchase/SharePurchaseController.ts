import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { SharePurchaseDTO } from "./SharePurchaseDTO";

export class SharePurchaseController extends HTTPController<SharePurchaseDTO.Request, SharePurchaseDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: SharePurchaseDTO.Request = {
            purchaseId: req.body.purchaseId,
            receiverContactId: req.body.receiverContactId
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