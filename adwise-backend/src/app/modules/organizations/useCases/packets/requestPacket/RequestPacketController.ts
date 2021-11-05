import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { RequestPacketDTO } from "./RequestPacketDTO";

export class RequestPacketController extends HTTPController<RequestPacketDTO.Request, RequestPacketDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: RequestPacketDTO.Request = {
            email: req.body.email,
            packetId: req.body.packetId,
            userId: req.decoded.userId,
            generateDocuments: true 
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