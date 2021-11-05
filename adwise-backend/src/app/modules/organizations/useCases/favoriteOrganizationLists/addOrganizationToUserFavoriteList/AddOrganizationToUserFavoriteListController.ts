import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { AddOrganizationToUserFavoriteListDTO } from "./AddOrganizationToUserFavoriteListDTO";

export class AddOrganizationToUserFavoriteListController extends HTTPController<AddOrganizationToUserFavoriteListDTO.Request, AddOrganizationToUserFavoriteListDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: AddOrganizationToUserFavoriteListDTO.Request = {
            userId: req.decoded.userId,
            organizationId: req.body.organizationId
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