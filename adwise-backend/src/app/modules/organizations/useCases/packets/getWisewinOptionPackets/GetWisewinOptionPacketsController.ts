import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetWisewinOptionPacketsDTO } from "./GetWisewinOptionPacketsDTO";

export class GetWisewinOptionPacketsController extends HTTPController<GetWisewinOptionPacketsDTO.Request, GetWisewinOptionPacketsDTO.Response> {
    protected async executeImplementation(_: Request, res: Response) {
        const dto: GetWisewinOptionPacketsDTO.Request = {
            
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