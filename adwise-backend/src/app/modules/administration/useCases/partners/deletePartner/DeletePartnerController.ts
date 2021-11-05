import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { DeletePartnerDTO } from "./DeletePartnerDTO";

export class DeletePartnerController extends HTTPController<DeletePartnerDTO.Request, DeletePartnerDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: DeletePartnerDTO.Request = {
            partnerId: req.params.id
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