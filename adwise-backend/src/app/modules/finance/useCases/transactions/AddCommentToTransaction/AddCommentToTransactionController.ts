import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { AddCommentToTransactionDTO } from "./AddCommentToTransactionDTO";

export class AddCommentToTransactionController extends HTTPController<AddCommentToTransactionDTO.Request, AddCommentToTransactionDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: AddCommentToTransactionDTO.Request = {
            transactionId: req.params.id,
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