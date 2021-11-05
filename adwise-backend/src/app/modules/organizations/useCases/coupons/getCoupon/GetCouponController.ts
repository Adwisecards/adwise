import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetCouponDTO } from "./GetCouponDTO";

export class GetCouponController extends HTTPController<GetCouponDTO.Request, GetCouponDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetCouponDTO.Request = {
            couponId: req.params.id
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