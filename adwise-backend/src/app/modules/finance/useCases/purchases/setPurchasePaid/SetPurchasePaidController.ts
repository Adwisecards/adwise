import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { SetPurchasePaidDTO } from "./SetPurchasePaidDTO";

export class SetPurchasePaidController extends HTTPController<SetPurchasePaidDTO.Request, SetPurchasePaidDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: SetPurchasePaidDTO.Request = {
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