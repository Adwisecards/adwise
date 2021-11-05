import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { FindAllTransactionsDTO } from "./FindAllTransactionsDTO";

export class FindAllTransactionsController extends HTTPController<FindAllTransactionsDTO.Request, FindAllTransactionsDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: FindAllTransactionsDTO.Request = {
            order: Number.parseInt(req.query.order as string),
            pageNumber: Number.parseInt(req.query.pageNumber as string),
            pageSize: Number.parseInt(req.query.pageSize as string),
            sortBy: req.query.sortBy as string,
            export: req.query.export == '1' ? true : false, 
            ...req.query
        };

        const result = await this.useCase.execute(dto);
        if (result.isFailure) {
            return this.handleError(res, result.getError()!);
        }

        const data = result.getValue()!;

        if (dto.export) {
            res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-disposition', 'attachment; filename=data.xlsx');
            res.send(data.transactions);
            return;
        }

        this.success(res, {data}, {
            cookies: [],
            headers: []
        });
    }
}