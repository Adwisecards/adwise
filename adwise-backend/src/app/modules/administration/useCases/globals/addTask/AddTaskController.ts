import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { AddTaskDTO } from "./AddTaskDTO";

export class AddTaskController extends HTTPController<AddTaskDTO.Request, AddTaskDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: AddTaskDTO.Request = {
            description: req.body.description,
            disabled: req.body.disabled,
            name: req.body.name,
            points: req.body.points
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