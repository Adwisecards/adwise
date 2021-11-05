import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { AddCouponToUserFavoriteListDTO } from "./AddCouponToUserFavoriteListDTO";

export class AddCouponToUserFavoriteListController extends HTTPController<AddCouponToUserFavoriteListDTO.Request, AddCouponToUserFavoriteListDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: AddCouponToUserFavoriteListDTO.Request = {
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