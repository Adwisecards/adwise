import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetUserFavoriteCouponsDTO } from "./GetUserFavoriteCouponsDTO";

export class GetUserFavoriteCouponsController extends HTTPController<GetUserFavoriteCouponsDTO.Request, GetUserFavoriteCouponsDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetUserFavoriteCouponsDTO.Request = {
            userId: req.decoded.userId
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