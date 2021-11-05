import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetRequestDTO } from "./GetRequestDTO";

export class GetRequestController extends HTTPController<GetRequestDTO.Request, GetRequestDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetRequestDTO.Request = {
            requestId: req.params.id
        };

        const result = await this.useCase.execute(dto);
        if (result.isFailure) {
            return this.handleError(res, result.getError()!);
        }

        const data = await result.getValue()!;
        this.success(res, {data}, {
            cookies: [],
            headers: []
        });
    }
}