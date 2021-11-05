import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { RemoveCouponFromUserHiddenListDTO } from "./RemoveCouponFromUserHiddenListDTO";

export class RemoveCouponFromUserHiddenListController extends HTTPController<RemoveCouponFromUserHiddenListDTO.Request, RemoveCouponFromUserHiddenListDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: RemoveCouponFromUserHiddenListDTO.Request = {
            userId: req.decoded.userId,
            couponId: req.body.couponId
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