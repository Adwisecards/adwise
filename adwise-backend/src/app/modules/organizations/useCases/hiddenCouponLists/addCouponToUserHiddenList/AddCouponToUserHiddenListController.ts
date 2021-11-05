import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { AddCouponToUserHiddenListDTO } from "./AddCouponToUserHiddenListDTO";

export class AddCouponToUserHiddenListController extends HTTPController<AddCouponToUserHiddenListDTO.Request, AddCouponToUserHiddenListDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: AddCouponToUserHiddenListDTO.Request = {
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