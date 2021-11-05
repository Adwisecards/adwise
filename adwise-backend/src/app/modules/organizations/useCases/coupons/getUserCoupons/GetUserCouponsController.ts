import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetUserCouponsDTO } from "./GetUserCouponsDTO";

export class GetUserCouponsController extends HTTPController<GetUserCouponsDTO.Request, GetUserCouponsDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetUserCouponsDTO.Request = {
            userId: req.decoded.userId,
            sortBy: req.query.sortBy || undefined as any,
            order: Number(req.query.order) || undefined as any
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