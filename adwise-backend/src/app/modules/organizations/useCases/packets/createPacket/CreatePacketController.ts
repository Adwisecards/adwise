import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { CreatePacketDTO } from "./CreatePacketDTO";

export class CreatePacketController extends HTTPController<CreatePacketDTO.Request, CreatePacketDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: CreatePacketDTO.Request = {
            limit: Number.parseInt(req.body.limit as string) as number || -1,
            price: Number.parseFloat(req.body.price as string) || -1,
            managerReward: Number.parseFloat(req.body.managerReward as string) || -1,
            name: req.body.name,
            currency: req.body.currency,
            refBonus: Number.parseFloat(req.body.refBonus as string) || -1,
            period: req.body.period,
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