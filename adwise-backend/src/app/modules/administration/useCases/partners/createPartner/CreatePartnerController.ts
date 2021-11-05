import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { CreatePartnerDTO } from "./CreatePartnerDTO";

export class CreatePartnerController extends HTTPController<CreatePartnerDTO.Request, CreatePartnerDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: CreatePartnerDTO.Request = {
            pictureMediaId: req.body.pictureMediaId,
            index: req.body.index,
            name: req.body.name,
            description: req.body.description,
            presentationUrl: req.body.presentationUrl
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