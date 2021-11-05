import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetUserDTO } from "./GetUserDTO";

export class GetUserController extends HTTPController<GetUserDTO.Request, GetUserDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetUserDTO.Request = {
            userId: req.params.id,
            populateEmployee: req.query.populateEmployee == '1'
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