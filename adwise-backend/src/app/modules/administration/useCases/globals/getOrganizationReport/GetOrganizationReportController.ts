import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetOrganizationReportDTO } from "./GetOrganizationReportDTO";

export class GetOrganizationReportController extends HTTPController<GetOrganizationReportDTO.Request, GetOrganizationReportDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        try {
            const dto: GetOrganizationReportDTO.Request = {
                organizationId: req.params.id,
            };
    
            const result = await this.useCase.execute(dto);
            if (result.isFailure) {
                return this.handleError(res, result.getError()!);
            }
    
            const data = result.getValue()!;
    
            res.setHeader('Content-type', 'application/octet-stream');
            res.setHeader('Content-disposition', 'attachment; filename='+data.filename);
            res.send(data.data);    
        } catch (ex) {
            console.log(ex);
        } 
    }
}