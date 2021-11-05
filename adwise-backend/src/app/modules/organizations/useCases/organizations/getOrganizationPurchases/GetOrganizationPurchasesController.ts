import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetOrganizationPurchasesDTO } from "./GetOrganizationPurchasesDTO";

export class GetOrganizationPurchasesController extends HTTPController<GetOrganizationPurchasesDTO.Request, GetOrganizationPurchasesDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetOrganizationPurchasesDTO.Request = {
            limit: Number.parseInt(req.query.limit as string) as number || 10,
            page: Number.parseInt(req.query.page as string) || 1,
            organizationId: req.params.id,
            dateFrom: req.query.dateFrom as string,
            dateTo: req.query.dateTo as string,
            export: req.query.export == '1',
            order: Number(req.query.order),
            sortBy: req.query.sortBy as string,
            multiple: req.query.multiple == '1',
            types: req.query.types as any || [],
            refCode: req.query.refCode as any,
            cashierContactId: req.query.cashierContactId as any,
            purchaserContactId: req.query.purchaserContactId as any
        };

        const result = await this.useCase.execute(dto);
        if (result.isFailure) {
            return this.handleError(res, result.getError()!);
        }

        const data = result.getValue()!;
        
        if (dto.export) {
            res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-disposition', 'attachment; filename=data.xlsx');
            res.send(data.purchases);
            return;
        }
        
        this.success(res, {data}, {
            cookies: [],
            headers: []
        });
    }
}