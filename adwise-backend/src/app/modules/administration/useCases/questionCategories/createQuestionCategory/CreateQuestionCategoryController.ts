import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { CreateQuestionCategoryDTO } from "./CreateQuestionCategoryDTO";

export class CreateQuestionCategoryController extends HTTPController<CreateQuestionCategoryDTO.Request, CreateQuestionCategoryDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: CreateQuestionCategoryDTO.Request = {
            name: req.body.name
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