import { Request, Response } from "express";
import { HTTPController } from "../../../../core/models/HTTPController";
import { GetTaskDTO } from "./GetTaskDTO";

export class GetTaskController extends HTTPController<GetTaskDTO.Request, GetTaskDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetTaskDTO.Request = {
            taskId: req.params.id
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