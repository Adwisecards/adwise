import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { DisableTaskDTO } from "./DisableTaskDTO";

export class DisableTaskController extends HTTPController<DisableTaskDTO.Request, DisableTaskDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: DisableTaskDTO.Request = {
            taskId: req.params.id,
            disabled: req.body.disabled
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