import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetOrganizationFinancialReportDTO } from "./GetOrganizationFinancialReportDTO";

export class GetOrganizationFinancialReportController extends HTTPController<GetOrganizationFinancialReportDTO.Request, GetOrganizationFinancialReportDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetOrganizationFinancialReportDTO.Request = {
            organizationId: req.params.id,
            dateFrom: req.query.dateFrom as string,
            dateTo: req.query.dateTo as string,
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