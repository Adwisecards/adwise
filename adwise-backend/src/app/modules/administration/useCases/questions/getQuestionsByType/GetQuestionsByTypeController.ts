import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetQuestionsByTypeDTO } from "./GetQuestionsByTypeDTO";

export class GetQuestionsbyTypeController extends HTTPController<GetQuestionsByTypeDTO.Request, GetQuestionsByTypeDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetQuestionsByTypeDTO.Request = {
            type: req.params.type
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