import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { DeleteDocumentDTO } from "./DeleteDocumentDTO";

export class DeleteDocumentController extends HTTPController<DeleteDocumentDTO.Request, DeleteDocumentDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: DeleteDocumentDTO.Request = {
            documentId: req.params.id
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