import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { SetPurchaseArchivedDTO } from "./SetPurchaseArchivedDTO";

export class SetPurchaseArchivedController extends HTTPController<SetPurchaseArchivedDTO.Request, SetPurchaseArchivedDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: SetPurchaseArchivedDTO.Request = {
            purchaseId: req.params.id,
            archived: req.body.archived,
            userId: req.decoded.userId
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