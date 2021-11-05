import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetOrganizationCitiesDTO } from "./GetOrganizationCitiesDTO";

export class GetOrganizationCitiesController extends HTTPController<GetOrganizationCitiesDTO.Request, GetOrganizationCitiesDTO.Response> {
    protected async executeImplementation(_: Request, res: Response) {
        const dto: GetOrganizationCitiesDTO.Request = {

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