import { Request, Response } from "express";
import { HTTPController } from "../../../../core/models/HTTPController";
import { GetAddressFromCoordsDTO } from "./GetAddressFromCoordsDTO";

export class GetAddressFromCoordsController extends HTTPController<GetAddressFromCoordsDTO.Request, GetAddressFromCoordsDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetAddressFromCoordsDTO.Request = {
            lat: Number.parseFloat(req.query.lat as string) || 0,
            long: Number.parseFloat(req.query.long as string) || 0,
            language: req.query.language as string
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