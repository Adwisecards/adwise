import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { FindAllPacketsSoldDTO } from "./FindAllPacketsSoldDTO";

export class FindAllPacketsSoldController extends HTTPController<FindAllPacketsSoldDTO.Request, FindAllPacketsSoldDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        try {
            const dto: FindAllPacketsSoldDTO.Request = {
                order: Number.parseInt(req.query.order as string),
                pageNumber: Number.parseInt(req.query.pageNumber as string),
                pageSize: Number.parseInt(req.query.pageSize as string),
                sortBy: req.query.sortBy as string,
                export: req.query.export == '1',
                ...req.query   
            };
    
            const result = await this.useCase.execute(dto);
            if (result.isFailure) {
                return this.handleError(res, result.getError()!);
            }
    
            const data = result.getValue()!;
    
            if (dto.export) {
                res.setHeader('content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('content-disposition', 'attachment; filename=data.xlsx')
                res.send(data.packets);
                
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