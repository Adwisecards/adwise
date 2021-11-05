import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import {CreateInvitationDTO} from './CreateInvitationDTO';

export class CreateInvitationController extends HTTPController<CreateInvitationDTO.Request, CreateInvitationDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: CreateInvitationDTO.Request = {
            organizationId: req.body.organizationId,
            couponId: req.body.couponId,
            userId: req.decoded.userId,
            invitationType: undefined as any
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