import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetUserByWisewinIdDTO } from "./GetUserByWisewinIdDTO";

export class GetUserByWisewinIdController extends HTTPController<GetUserByWisewinIdDTO.Request, GetUserByWisewinIdDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetUserByWisewinIdDTO.Request = {
            wisewinId: req.params.id
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