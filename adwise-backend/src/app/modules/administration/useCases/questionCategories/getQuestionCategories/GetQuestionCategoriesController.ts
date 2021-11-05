import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetQuestionCategoriesDTO } from "./GetQuestionCategoriesDTO";

export class GetQuestionCategoriesController extends HTTPController<GetQuestionCategoriesDTO.Request, GetQuestionCategoriesDTO.Response> {
    protected async executeImplementation(_: Request, res: Response) {
        const dto: GetQuestionCategoriesDTO.Request = {

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