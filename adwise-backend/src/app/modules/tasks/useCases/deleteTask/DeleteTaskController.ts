import { Request, Response } from "express";
import { HTTPController } from "../../../../core/models/HTTPController";
import { DeleteTaskDTO } from "./DeleteTaskDTO";

export class DeleteTaskController extends HTTPController<DeleteTaskDTO.Request, DeleteTaskDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: DeleteTaskDTO.Request = {
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