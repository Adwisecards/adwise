import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetVersionsDTO } from "./GetVersionsDTO";

export class GetVersionsController extends HTTPController<GetVersionsDTO.Request, GetVersionsDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetVersionsDTO.Request = {
            type: req.query.type as string
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