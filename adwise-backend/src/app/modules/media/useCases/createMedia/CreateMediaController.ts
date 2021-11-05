import { Request, Response } from "express";
import { HTTPController } from "../../../../core/models/HTTPController";
import { CreateMediaDTO } from "./CreateMediaDTO";

export class CreateMediaController extends HTTPController<CreateMediaDTO.Request, CreateMediaDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: CreateMediaDTO.Request = {
            data: req.files!.data?.data,
            mimeType: req.files!.data?.mimetype,
            type: req.body.type
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