import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { FindAllOrganizationsDTO } from "./FindAllOrganizationsDTO";

export class FindAllOrganizationsController extends HTTPController<FindAllOrganizationsDTO.Request, FindAllOrganizationsDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: FindAllOrganizationsDTO.Request = {
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
            res.send(data.organizations);
            return;
        }

        this.success(res, {data}, {
            cookies: [],
            headers: []
        });
    }
}