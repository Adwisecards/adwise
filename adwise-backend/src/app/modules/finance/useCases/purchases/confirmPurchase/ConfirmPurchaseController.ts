import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { ConfirmPurchaseDTO } from "./ConfirmPurchaseDTO";

export class ConfirmPurchaseController extends HTTPController<ConfirmPurchaseDTO.Request, ConfirmPurchaseDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: ConfirmPurchaseDTO.Request = {
            purchaseId: req.params.id
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