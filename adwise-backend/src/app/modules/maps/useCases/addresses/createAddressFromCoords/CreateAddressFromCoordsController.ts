import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { CreateAddressFromCoordsDTO } from "./CreateAddressFromCoordsDTO";

export class CreateAddressFromCoordsController extends HTTPController<CreateAddressFromCoordsDTO.Request, CreateAddressFromCoordsDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: CreateAddressFromCoordsDTO.Request = {
            lat: req.body.lat,
            long: req.body.long,
            details: req.body.details,
            language: req.body.language
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