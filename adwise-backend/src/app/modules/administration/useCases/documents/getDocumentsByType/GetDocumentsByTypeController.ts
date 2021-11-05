import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetDocumentsByTypeDTO } from "./GetDocumentsByTypeDTO";

export class GetDocumentsByTypeController extends HTTPController<GetDocumentsByTypeDTO.Request, GetDocumentsByTypeDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetDocumentsByTypeDTO.Request = {
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