import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { ChooseWisewinOptionPacketDTO } from "./ChooseWisewinOptionPacketDTO";

export class ChooseWisewinOptionPacketController extends HTTPController<ChooseWisewinOptionPacketDTO.Request, ChooseWisewinOptionPacketDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: ChooseWisewinOptionPacketDTO.Request = {
            userId: req.decoded.userId,
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