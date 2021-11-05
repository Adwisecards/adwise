import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetAdvantagesDTO } from "./GetAdvantagesDTO";

export class GetAdvantagesController extends HTTPController<GetAdvantagesDTO.Request, GetAdvantagesDTO.Response> {
    protected async executeImplementation(_: Request, res: Response) {
        const dto: GetAdvantagesDTO.Request = {
            
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