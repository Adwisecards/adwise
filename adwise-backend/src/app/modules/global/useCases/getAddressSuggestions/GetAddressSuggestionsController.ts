import { Request, Response } from "express";
import { HTTPController } from "../../../../core/models/HTTPController";
import { GetAddressSuggestionsDTO } from "./GetAddressSuggestionsDTO";

export class GetAddressSuggestionsController extends HTTPController<GetAddressSuggestionsDTO.Request, GetAddressSuggestionsDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetAddressSuggestionsDTO.Request = {
            input: req.query.search as string || '',
            language: req.query.language as string || ''
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