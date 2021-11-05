import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetProductDTO } from "./GetProductDTO";

export class GetProductController extends HTTPController<GetProductDTO.Request, GetProductDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetProductDTO.Request = {
            productId: req.params.id
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