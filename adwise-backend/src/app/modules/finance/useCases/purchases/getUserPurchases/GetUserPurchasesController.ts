import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetUserPurchasesDTO } from "./GetUserPurchasesDTO";

export class GetUserPurchasesController extends HTTPController<GetUserPurchasesDTO.Request, GetUserPurchasesDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetUserPurchasesDTO.Request = {
            userId: req.decoded.userId,
            limit: Number.parseInt(req.query.limit as string),
            page: Number.parseInt(req.query.page as string),
            multiple: req.query.multiple == '1',
            types: req.query.types as any || [],
            dateFrom: req.query.dateFrom as any,
            dateTo: req.query.dateTo as any,
            refCode: req.query.refCode as any,
            organizationName: req.query.organizationName as any
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