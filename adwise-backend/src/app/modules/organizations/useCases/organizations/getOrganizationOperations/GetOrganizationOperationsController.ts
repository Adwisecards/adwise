import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetOrganizationOperationsDTO } from "./GetOrganizationOperationsDTO";

export class GetOrganizationOperationsController extends HTTPController<GetOrganizationOperationsDTO.Request, GetOrganizationOperationsDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetOrganizationOperationsDTO.Request = {
            limit: Number.parseInt(req.query.limit as string) as number || 1000,
            page: Number.parseInt(req.query.page as string) || 1,
            export: req.query.export == '1',
            organizationId: req.params.id,
            dateFrom: req.query.dateFrom as string,
            dateTo: req.query.dateTo as string
        };

        const result = await this.useCase.execute(dto);
        if (result.isFailure) {
            return this.handleError(res, result.getError()!);
        }

        const data = result.getValue()!;

        if (dto.export) {
            res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-disposition', 'attachment; filename=operations.xlsx');
            res.send(data.operations);
            return;
        }

        this.success(res, {data}, {
            cookies: [],
            headers: []
        });
    }
}