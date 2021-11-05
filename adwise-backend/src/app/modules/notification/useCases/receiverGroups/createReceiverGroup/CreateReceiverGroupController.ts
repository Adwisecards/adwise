import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { CreateReceiverGroupDTO } from "./CreateReceiverGroupDTO";

export class CreateReceiverGroupController extends HTTPController<CreateReceiverGroupDTO.Request, CreateReceiverGroupDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: CreateReceiverGroupDTO.Request = {
            name: req.body.name,
            parameters: req.body.parameters,
            wantedReceiverIds: req.body.wantedReceiverIds
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