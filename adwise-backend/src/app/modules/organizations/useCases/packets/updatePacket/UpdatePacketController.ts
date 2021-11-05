import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { UpdatePacketDTO } from "./UpdatePacketDTO";

export class UpdatePacketController extends HTTPController<UpdatePacketDTO.Request, UpdatePacketDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: UpdatePacketDTO.Request = {
            packetId: req.params.id,
            name: req.body.name,
            price: req.body.price,
            wisewinOption: req.body.wisewinOption
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