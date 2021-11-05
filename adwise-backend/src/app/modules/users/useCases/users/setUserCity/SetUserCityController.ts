import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { SetUserCityDTO } from "./SetUserCityDTO";

export class SetUserCityController extends HTTPController<SetUserCityDTO.Request, SetUserCityDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: SetUserCityDTO.Request = {
            city: req.body.city,
            userId: req.decoded.userId
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