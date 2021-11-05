import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { FindCouponsDTO } from "./FindCouponsDTO";

export class FindCouponsController extends HTTPController<FindCouponsDTO.Request, FindCouponsDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: FindCouponsDTO.Request = {
            limit: Number.parseInt(req.query.limit as string) as number || 10,
            page: Number.parseInt(req.query.page as string) || 1,
            userId: req.decoded.userId,
            search: req.query.search?.toString() || ''
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