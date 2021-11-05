import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { CreateQuestionDTO } from "./CreateQuestionDTO";

export class CreateQuestionController extends HTTPController<CreateQuestionDTO.Request, CreateQuestionDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: CreateQuestionDTO.Request = {
            question: req.body.question,
            answer: req.body.answer,
            type: req.body.type,
            categoryId: req.body.categoryId
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