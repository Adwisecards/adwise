import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetUserJwtDTO } from "./GetUserJwtDTO";

export class GetUserJwtController extends HTTPController<GetUserJwtDTO.Request, GetUserJwtDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetUserJwtDTO.Request = {
            userId: req.params.id
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