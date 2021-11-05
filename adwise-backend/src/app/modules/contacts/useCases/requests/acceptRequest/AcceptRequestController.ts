import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { AcceptRequestDTO } from "./AcceptRequestDTO";

export class AcceptRequestController extends HTTPController<AcceptRequestDTO.Request, AcceptRequestDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: AcceptRequestDTO.Request = {
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