import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { CreateRequestDTO } from "./CreateRequestDTO";

export class CreateRequestController extends HTTPController<CreateRequestDTO.Request, CreateRequestDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: CreateRequestDTO.Request = {
            from: req.body.from,
            to: req.body.to
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