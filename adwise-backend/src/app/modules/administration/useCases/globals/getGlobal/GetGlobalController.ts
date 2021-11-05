import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetGlobalDTO } from "./GetGlobalDTO";

export class GetGlobalController extends HTTPController<GetGlobalDTO.Request, GetGlobalDTO.Response> {
    protected async executeImplementation(_: Request, res: Response) {
        const dto: GetGlobalDTO.Request = {};

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