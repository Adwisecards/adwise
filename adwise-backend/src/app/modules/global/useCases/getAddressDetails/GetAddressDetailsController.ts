import { Request, Response } from "express";
import { HTTPController } from "../../../../core/models/HTTPController";
import { GetAddressDetailsDTO } from "./GetAddressDetailsDTO";

export class GetAddressDetailsController extends HTTPController<GetAddressDetailsDTO.Request, GetAddressDetailsDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetAddressDetailsDTO.Request = {
            placeId: req.params.id,
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