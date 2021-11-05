import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { FindAllCouponsDTO } from "./FindAllCouponsDTO";

export class FindAllCouponsController extends HTTPController<FindAllCouponsDTO.Request, FindAllCouponsDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: FindAllCouponsDTO.Request = {
            order: Number.parseInt(req.query.order as string),
            pageNumber: Number.parseInt(req.query.pageNumber as string),
            pageSize: Number.parseInt(req.query.pageSize as string),
            sortBy: req.query.sortBy as string,
            ...req.query
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