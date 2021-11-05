import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { UpdateAdvantageDTO } from "./UpdateAdvantageDTO";

export class UpdateAdvantageController extends HTTPController<UpdateAdvantageDTO.Request, UpdateAdvantageDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: UpdateAdvantageDTO.Request = {
            advantageId: req.params.id,
            pictureMediaId: req.body.pictureMediaId,
            index: req.body.index,
            name: req.body.name
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