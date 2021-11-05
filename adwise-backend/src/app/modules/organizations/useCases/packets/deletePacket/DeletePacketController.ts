import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { DeletePacketDTO } from "./DeletePacketDTO";

export class DeletePacketController extends HTTPController<DeletePacketDTO.Request, DeletePacketDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: DeletePacketDTO.Request = {
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