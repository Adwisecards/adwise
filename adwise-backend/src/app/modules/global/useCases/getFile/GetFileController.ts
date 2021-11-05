import { Request, Response } from "express";
import { HTTPController } from "../../../../core/models/HTTPController";
import { GetFileDTO } from "./GetFileDTO";

export class GetFileController extends HTTPController<GetFileDTO.Request, GetFileDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetFileDTO.Request = {
            filename: req.params.filename as string
        };

        const result = await this.useCase.execute(dto);
        if (result.isFailure) {
            return this.handleError(res, result.getError()!);
        }

        const data = result.getValue()!;

        res.setHeader('Content-type', data.mimeType);
        res.setHeader('Content-disposition', 'attachment; filename='+dto.filename);
        res.send(data.data);
        
        return;
    }
}