import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { CancelRequestDTO } from "./CancelRequestDTO";

export class CancelRequestController extends HTTPController<CancelRequestDTO.Request, CancelRequestDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: CancelRequestDTO.Request = {
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