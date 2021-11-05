import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetUserByInvitationDTO } from "./GetUserByInvitationDTO";

export class GetUserByInvitationController extends HTTPController<GetUserByInvitationDTO.Request, GetUserByInvitationDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetUserByInvitationDTO.Request = {
            invitationId: req.params.id
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