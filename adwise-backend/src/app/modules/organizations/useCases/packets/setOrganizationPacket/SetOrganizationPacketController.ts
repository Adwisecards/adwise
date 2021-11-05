import { Request, Response } from "express";
import { boolean } from "joi";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { SetOrganizationPacketDTO } from "./SetOrganizationPacketDTO";

export class SetOrganizationPacketController extends HTTPController<SetOrganizationPacketDTO.Request, SetOrganizationPacketDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: SetOrganizationPacketDTO.Request = {
            organizationId: req.params.id,
            packetId: req.body.packetId,
            date: req.body.date,
            noRecord: req.body.noRecord,
            reason: req.body.reason
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