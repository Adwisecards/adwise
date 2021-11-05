import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { FindAllUsersDTO } from "./FindAllUsersDTO";

export class FindAllUsersController extends HTTPController<FindAllUsersDTO.Request, FindAllUsersDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: FindAllUsersDTO.Request = {
            order: Number.parseInt(req.query.order as string),
            pageNumber: Number.parseInt(req.query.pageNumber as string),
            pageSize: Number.parseInt(req.query.pageSize as string),
            sortBy: req.query.sortBy as string,
            export: req.query.export == '1',
            ...req.query    
        };

        const result = await this.useCase.execute(dto);
        if (result.isFailure) {
            console.log(result);
            return this.handleError(res, result.getError()!);
        }

        const data = result.getValue()!;

        if (dto.export) {
            res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-disposition', 'attachment; filename=data.xlsx');
            res.send(data.users);
            return;
        }

        this.success(res, {data}, {
            cookies: [],
            headers: []
        });
    }
}