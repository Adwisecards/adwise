import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { SubscribeToOrganizationDTO } from "./SubscribeToOrganizationDTO";

export class SubscribeToOrganizationController extends HTTPController<SubscribeToOrganizationDTO.Request, SubscribeToOrganizationDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        try {
            const dto: SubscribeToOrganizationDTO.Request = {
                contactId: req.body.contactId,
                userId: req.decoded.userId,
                organizationId: req.params.id,
                invitationId: req.body.invitationId,
                followingUserId: req.body.followingUserId
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
        } catch (ex) {
            console.log(ex);
        }
    }
}