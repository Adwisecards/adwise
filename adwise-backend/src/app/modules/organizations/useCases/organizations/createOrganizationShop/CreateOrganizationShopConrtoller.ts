import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { CreateOrganizationShopDTO } from "./CreateOrganizationShopDTO";

export class CreateOrganizationShopController extends HTTPController<CreateOrganizationShopDTO.Request, CreateOrganizationShopDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: CreateOrganizationShopDTO.Request = {
            userId: req.decoded.userId,
            organizationId: req.params.id
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