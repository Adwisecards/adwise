import { Request, Response } from "express";
import { HTTPController } from "../../../../core/models/HTTPController";
import { GetRefByCodeDTO } from "./GetRefByCodeDTO";

export class GetRefByCodeController extends HTTPController<GetRefByCodeDTO.Request, GetRefByCodeDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetRefByCodeDTO.Request = {
            code: req.params.code
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