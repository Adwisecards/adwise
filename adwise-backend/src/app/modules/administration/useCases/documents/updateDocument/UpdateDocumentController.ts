import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { UpdateDocumentDTO } from "./UpdateDocumentDTO";

export class UpdateDocumentController extends HTTPController<UpdateDocumentDTO.Request, UpdateDocumentDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: UpdateDocumentDTO.Request = {
            documentId: req.params.id,
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