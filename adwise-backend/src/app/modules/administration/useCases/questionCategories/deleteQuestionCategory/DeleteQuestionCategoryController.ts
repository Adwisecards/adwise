import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { DeleteQuestionCategoryDTO } from "./DeleteQuestionCategoryDTO";

export class DeleteQuestionCategoryController extends HTTPController<DeleteQuestionCategoryDTO.Request, DeleteQuestionCategoryDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: DeleteQuestionCategoryDTO.Request = {
            questionCategoryId: req.params.id
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