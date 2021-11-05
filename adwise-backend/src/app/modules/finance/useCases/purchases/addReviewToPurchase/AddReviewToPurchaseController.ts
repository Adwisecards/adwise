import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { AddReviewToPurchaseDTO } from "./AddReviewToPurchaseDTO";

export class AddReviewToPurchaseController extends HTTPController<AddReviewToPurchaseDTO.Request, AddReviewToPurchaseDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: AddReviewToPurchaseDTO.Request = {
            purchaseId: req.params.id,
            review: req.body.review,
            rating: req.body.rating
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