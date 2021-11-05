import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { CreateGlobalShopDTO } from "./CreateGlobalShopDTO";

export class CreateGlobalShopController extends HTTPController<CreateGlobalShopDTO.Request, CreateGlobalShopDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: CreateGlobalShopDTO.Request = {
            ...req.body
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