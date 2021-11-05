import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetCouponsByCategoryDTO } from "./GetCouponsByCategoryDTO";

export class GetCouponsByCategoryController extends HTTPController<GetCouponsByCategoryDTO.Request, GetCouponsByCategoryDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetCouponsByCategoryDTO.Request = {
            contactId: req.params.id,
            category: req.query.category as string || ''
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