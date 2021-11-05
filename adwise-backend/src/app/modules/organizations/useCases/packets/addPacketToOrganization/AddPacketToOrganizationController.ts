import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { AddPacketToOrganizationDTO } from "./AddPacketToOrganizationDTO";

export class AddPacketToOrganizationController extends HTTPController<AddPacketToOrganizationDTO.Request, AddPacketToOrganizationDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: AddPacketToOrganizationDTO.Request = {
            organizationId: req.body.organizationId,
            packetId: req.body.packetId,
            default: false,
            date: undefined as any,
            reason: req.body.reason,
            customPacket: req.body.customPacket
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