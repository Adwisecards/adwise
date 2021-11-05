import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { DisablePacketDTO } from "./DisablePacketDTO";

export class DisablePacketController extends HTTPController<DisablePacketDTO.Request, DisablePacketDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: DisablePacketDTO.Request = {
            disabled: req.body.disabled,
            packetId: req.params.id
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