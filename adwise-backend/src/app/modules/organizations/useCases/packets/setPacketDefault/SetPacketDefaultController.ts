import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { SetPacketDefaultDTO } from "./SetPacketDefaultDTO";

export class SetPacketDefaultController extends HTTPController<SetPacketDefaultDTO.Request, SetPacketDefaultDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: SetPacketDefaultDTO.Request = {
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