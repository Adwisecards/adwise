import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { SetOrganizationOnlineDTO } from "./SetOrganizationOnlineDTO";

export class SetOrganizationOnlineController extends HTTPController<SetOrganizationOnlineDTO.Request, SetOrganizationOnlineDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: SetOrganizationOnlineDTO.Request = {
            organizationId: req.params.id,
            online: req.body.online
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