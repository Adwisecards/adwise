import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { UpdateReceiverGroupDTO } from "./UpdateReceiverGroupDTO";

export class UpdateReceiverGroupController extends HTTPController<UpdateReceiverGroupDTO.Request, UpdateReceiverGroupDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: UpdateReceiverGroupDTO.Request = {
            receiverGroupId: req.params.id
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