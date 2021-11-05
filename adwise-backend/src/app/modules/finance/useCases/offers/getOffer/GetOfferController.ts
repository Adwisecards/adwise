import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetOfferDTO } from "./GetOfferDTO";

export class GetOfferController extends HTTPController<GetOfferDTO.Request, GetOfferDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetOfferDTO.Request = {
            offerId: req.params.id
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