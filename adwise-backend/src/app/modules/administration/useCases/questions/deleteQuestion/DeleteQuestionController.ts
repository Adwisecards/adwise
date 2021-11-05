import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { DeleteQuestionDTO } from "./DeleteQuestionDTO";

export class DeleteQuestionController extends HTTPController<DeleteQuestionDTO.Request, DeleteQuestionDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: DeleteQuestionDTO.Request = {
            questionId: req.params.id
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