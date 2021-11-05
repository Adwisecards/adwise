import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { FindAllBankPaymentsDTO } from "./FindAllBankPaymentsDTO";

export class FindAllBankPaymentsController extends HTTPController<FindAllBankPaymentsDTO.Request, FindAllBankPaymentsDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: FindAllBankPaymentsDTO.Request = {
            order: Number.parseInt(req.query.order as string),
            pageNumber: Number.parseInt(req.query.pageNumber as string),
            pageSize: Number.parseInt(req.query.pageSize as string),
            sortBy: req.query.sortBy as string
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