import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { CreateAdvantageDTO } from "./CreateAdvantageDTO";

export class CreateAdvantageController extends HTTPController<CreateAdvantageDTO.Request, CreateAdvantageDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: CreateAdvantageDTO.Request = {
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