import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { DeleteContactDTO } from "./DeleteContactDTO";

export class DeleteContactController extends HTTPController<DeleteContactDTO.Request, DeleteContactDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: DeleteContactDTO.Request = {
            contactId: req.params.id
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