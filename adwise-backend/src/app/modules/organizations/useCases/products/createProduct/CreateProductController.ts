import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { CreateProductDTO } from "./CreateProductDTO";

export class CreateProductController extends HTTPController<CreateProductDTO.Request, CreateProductDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: CreateProductDTO.Request = {
            ...req.body,
            price: Number.parseFloat(req.body.price) || 0,
            pictureFile: req.files && req.files!.picture ? {
                data: req.files!.picture.data,
                filename: req.files!.picture.name
            } : undefined as any
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