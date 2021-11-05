import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetPacketsDTO } from "./GetPacketsDTO";

export class GetPacketsController extends HTTPController<GetPacketsDTO.Request, GetPacketsDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetPacketsDTO.Request = {
            all: req.query.all == '1'  ? true : false
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