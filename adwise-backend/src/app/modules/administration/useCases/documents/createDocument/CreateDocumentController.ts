import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { CreateDocumentDTO } from "./CreateDocumentDTO";

export class CreateDocumentController extends HTTPController<CreateDocumentDTO.Request, CreateDocumentDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: CreateDocumentDTO.Request = {
            fileMediaId: req.body.fileMediaId,
            index: req.body.index,
            name: req.body.name,
            description: req.body.description,
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