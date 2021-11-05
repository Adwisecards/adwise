import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { FindContactsDTO } from "./FindContactsDTO";

export class FindContactsController extends HTTPController<FindContactsDTO.Request, FindContactsDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: FindContactsDTO.Request = {
            limit: Number.parseInt(req.query.limit as string) as number || 10,
            page: Number.parseInt(req.query.page as string) || 1,
            userId: req.decoded.userId
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