import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { AddCommentToPurchaseDTO } from "./AddCommentToPurchaseDTO";

export class AddCommentToPurchaseController extends HTTPController<AddCommentToPurchaseDTO.Request, AddCommentToPurchaseDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: AddCommentToPurchaseDTO.Request = {
            purchaseId: req.params.id,
            comment: req.body.comment,
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