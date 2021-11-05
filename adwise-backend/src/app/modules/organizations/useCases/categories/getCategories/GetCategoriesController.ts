import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetCategoriesDTO } from "./GetCategoriesDTO";

export class GetCategoriesController extends HTTPController<GetCategoriesDTO.Request, GetCategoriesDTO.Response> {
    protected async executeImplementation(_: Request, res: Response) {
        const dto: GetCategoriesDTO.Request = {

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