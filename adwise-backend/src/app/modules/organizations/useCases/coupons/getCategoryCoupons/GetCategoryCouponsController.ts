import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetCategoryCouponsDTO } from "./GetCategoryCouponsDTO";

export class GetCategoryCouponsController extends HTTPController<GetCategoryCouponsDTO.Request, GetCategoryCouponsDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const result = await this.useCase.execute({
            contactId: req.params.id
        });
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