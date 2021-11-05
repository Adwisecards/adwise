import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { UpdateVersionDTO } from "./UpdateVersionDTO";

export class UpdateVersionController extends HTTPController<UpdateVersionDTO.Request, UpdateVersionDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: UpdateVersionDTO.Request = {
            versionId: req.params.id,
            comment: req.body.comment,
            date: req.body.date,
            title: req.body.title,
            type: req.body.type,
            version: req.body.version
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