import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { SetAddressCoordsDTO } from "./SetAddressCoordsDTO";

export class SetAddressCoordsController extends HTTPController<SetAddressCoordsDTO.Request, SetAddressCoordsDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: SetAddressCoordsDTO.Request = {
            organizationId: req.params.id,
            coords: req.body.coords,
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