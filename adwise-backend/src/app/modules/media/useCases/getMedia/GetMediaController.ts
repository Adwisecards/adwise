import { Request, Response } from "express";
import { HTTPController } from "../../../../core/models/HTTPController";
import { GetMediaDTO } from "./GetMediaDTO";

export class GetMediaController extends HTTPController<GetMediaDTO.Request, GetMediaDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetMediaDTO.Request = {
            mediaId: req.params.id
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