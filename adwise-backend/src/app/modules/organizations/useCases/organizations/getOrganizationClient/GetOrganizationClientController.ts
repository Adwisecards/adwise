import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetOrganizationClientDTO } from "./GetOrganizationClientDTO";

export class GetOrganizationClientController extends HTTPController<GetOrganizationClientDTO.Request, GetOrganizationClientDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetOrganizationClientDTO.Request = {
            clientId: req.params.id
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