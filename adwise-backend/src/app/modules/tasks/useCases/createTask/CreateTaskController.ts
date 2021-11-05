import { Request, Response } from "express";
import { HTTPController } from "../../../../core/models/HTTPController";
import { CreateTaskDTO } from "./CreateTaskDTO";

export class CreateTaskController extends HTTPController<CreateTaskDTO.Request, CreateTaskDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: CreateTaskDTO.Request = {
            ...req.body
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