import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { CancelPurchaseDTO } from "./CancelPurchaseDTO";

export class CancelPurchaseController extends HTTPController<CancelPurchaseDTO.Request, CancelPurchaseDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: CancelPurchaseDTO.Request = {
            purchaseId: req.params.id,
            internal: true
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