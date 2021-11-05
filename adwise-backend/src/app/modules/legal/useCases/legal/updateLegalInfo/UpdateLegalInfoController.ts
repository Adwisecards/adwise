import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { UpdateLegalInfoDTO } from "./UpdateLegalInfoDTO";

export class UpdateLegalInfoController extends HTTPController<UpdateLegalInfoDTO.Request, UpdateLegalInfoDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: UpdateLegalInfoDTO.Request = {
            userId: req.decoded.userId,
            organizationId: req.body.organizationId,
            info: req.body.info
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