import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetOrganizationClientsDTO } from "./GetOrganizationClientsDTO";

export class GetOrganizationClientsController extends HTTPController<GetOrganizationClientsDTO.Request, GetOrganizationClientsDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        try {
            const dto: GetOrganizationClientsDTO.Request = {
                limit: Number.parseInt(req.query.limit as string) as number || 10,
                page: Number.parseInt(req.query.page as string) || 1,
                organizationId: req.params.id,
                order: Number.parseInt(req.query.order as string),
                sortBy: req.query.sortBy as string,
                export: req.query.export == '1',
                search: req.query.search?.toString()
            };
    
            const result = await this.useCase.execute(dto);
            if (result.isFailure) {
                return this.handleError(res, result.getError()!);
            }
    
            const data = result.getValue()!;
    
            if (dto.export) {
                res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('Content-disposition', 'attachment; filename=data.xlsx');
                res.send(data.clients);
                return;
            }
    
            this.success(res, {data}, {
                cookies: [],
                headers: []
            });
        } catch (ex) {
            console.log(ex);
        }
    }
}