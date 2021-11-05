import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { FindAllPaymentsDTO } from "./FindAllPaymentsDTO";

export class FindAllPaymentsController extends HTTPController<FindAllPaymentsDTO.Request, FindAllPaymentsDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: FindAllPaymentsDTO.Request = {
            order: Number.parseInt(req.query.order as string),
            pageNumber: Number.parseInt(req.query.pageNumber as string),
            pageSize: Number.parseInt(req.query.pageSize as string),
            sortBy: req.query.sortBy as string,
            ...req.query,
            export: req.query.export == '1'
        };

        const result = await this.useCase.execute(dto);
        if (result.isFailure) {
            return this.handleError(res, result.getError()!);
        }

        const data = result.getValue()!;

        if (dto.export) {
            res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-disposition', 'attachment; filename=data.xlsx');
            res.send(data.payments);
            return;
        }

        this.success(res, {data}, {
            cookies: [],
            headers: []
        });
    }
}