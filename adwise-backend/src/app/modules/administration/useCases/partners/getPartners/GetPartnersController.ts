import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetPartnersDTO } from "./GetPartnersDTO";

export class GetPartnersController extends HTTPController<GetPartnersDTO.Request, GetPartnersDTO.Response> {
    protected async executeImplementation(_: Request, res: Response) {
        const dto: GetPartnersDTO.Request = {
            
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