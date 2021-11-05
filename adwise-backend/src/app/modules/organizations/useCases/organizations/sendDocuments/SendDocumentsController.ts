import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { SendDocumentsDTO } from "./SendDocumentsDTO";

export class SendDocumentsController extends HTTPController<SendDocumentsDTO.Request, SendDocumentsDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: SendDocumentsDTO.Request = {
            comment: req.body.comment,
            userId: req.decoded.userId,
            files: []
        };

        const files: SendDocumentsDTO.Request['files'] = [];

        if (req.files && req.files!.files) {
            if (!(<any>req.files!.files).length) {
                (<any>req.files!.files) = [req.files!.files];
            }

            for (const file of req.files!.files as any) {
                files.push({
                    data: file.data,
                    filename: file.name
                });
            }
        }

        console.log(files.length);

        if (files.length) {
            dto.files = files;
        }

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