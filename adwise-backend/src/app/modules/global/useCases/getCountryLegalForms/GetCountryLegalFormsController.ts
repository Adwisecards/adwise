import { Request, Response } from "express";
import { HTTPController } from "../../../../core/models/HTTPController";
import { GetCountryLegalFormsDTO } from "./GetCountryLegalFormsDTO";

export class GetCountryLegalFormsController extends HTTPController<GetCountryLegalFormsDTO.Request, GetCountryLegalFormsDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetCountryLegalFormsDTO.Request = {
            country: req.query.country as string
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