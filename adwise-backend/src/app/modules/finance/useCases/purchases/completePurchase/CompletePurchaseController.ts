import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { CompletePurchaseDTO } from "./CompletePurchaseDTO";

export class CompletePurchaseController extends HTTPController<CompletePurchaseDTO.Request, CompletePurchaseDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: CompletePurchaseDTO.Request = {
            purchaseId: req.params.id,
            cashierContactId: req.body.cashierContactId
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