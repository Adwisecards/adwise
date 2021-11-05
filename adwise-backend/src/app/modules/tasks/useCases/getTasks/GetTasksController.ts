import { Request, Response } from "express";
import { HTTPController } from "../../../../core/models/HTTPController";
import { GetTasksDTO } from "./GetTasksDTO";

export class GetTasksController extends HTTPController<GetTasksDTO.Request, GetTasksDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetTasksDTO.Request = {
            contactId: req.params.id
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