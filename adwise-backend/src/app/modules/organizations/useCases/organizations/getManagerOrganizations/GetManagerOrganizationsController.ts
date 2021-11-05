import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetManagerOrganizationsDTO } from "./GetManagerOrganizationsDTO";

export class GetManagerOrganizationsController extends HTTPController<GetManagerOrganizationsDTO.Request, GetManagerOrganizationsDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetManagerOrganizationsDTO.Request = {
            userId: req.decoded.userId
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