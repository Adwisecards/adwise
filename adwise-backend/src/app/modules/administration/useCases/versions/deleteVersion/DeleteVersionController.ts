import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { DeleteVersionDTO } from "./DeleteVersionDTO";

export class DeleteVersionController extends HTTPController<DeleteVersionDTO.Request, DeleteVersionDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: DeleteVersionDTO.Request = {
            versionId: req.params.id
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