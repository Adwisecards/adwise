import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { DisableProductDTO } from "./DisableProductDTO";

export class DisableProductController extends HTTPController<DisableProductDTO.Request, DisableProductDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: DisableProductDTO.Request = {
            productId: req.params.id,
            disabled: req.body.disabled
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