import { Request, Response } from "express";
import { HTTPController } from "../../../../core/models/HTTPController";
import { GetMediaDataDTO } from "./GetMediaDataDTO";

export class GetMediaDataController extends HTTPController<GetMediaDataDTO.Request, GetMediaDataDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetMediaDataDTO.Request = {
            mediaId: req.params.id
        };
        
        const result = await this.useCase.execute(dto);
        if (result.isFailure) {
            return this.handleError(res, result.getError()!);
        }
        
        const data = result.getValue()!;
        
        res.setHeader('Content-type', data.mimeType);
        res.send(data.data);
    }
}