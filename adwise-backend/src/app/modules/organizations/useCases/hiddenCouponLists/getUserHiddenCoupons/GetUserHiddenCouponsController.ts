import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetUserHiddenCouponsDTO } from "./GetUserHiddenCouponsDTO";

export class GetUserHiddenCouponsController extends HTTPController<GetUserHiddenCouponsDTO.Request, GetUserHiddenCouponsDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetUserHiddenCouponsDTO.Request = {
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