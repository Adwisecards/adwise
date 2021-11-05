import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { UpdateQuestionDTO } from "./UpdateQuestionDTO";

export class UpdateQuestionController extends HTTPController<UpdateQuestionDTO.Request, UpdateQuestionDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: UpdateQuestionDTO.Request = {
            question: req.body.question,
            answer: req.body.answer,
            type: req.body.type,
            categoryId: req.body.categoryId,
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