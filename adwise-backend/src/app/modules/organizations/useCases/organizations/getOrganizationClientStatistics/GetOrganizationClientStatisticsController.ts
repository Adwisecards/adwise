import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetOrganizationClientStatisticsDTO } from "./GetOrganizationClientStatisticsDTO";

export class GetOrganizationClientStatisticsController extends HTTPController<GetOrganizationClientStatisticsDTO.Request, GetOrganizationClientStatisticsDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetOrganizationClientStatisticsDTO.Request = {
            organizationId: req.params.id,
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