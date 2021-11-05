import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { SetUserParentDTO } from "./SetUserParentDTO";

export class SetUserParentController extends HTTPController<SetUserParentDTO.Request, SetUserParentDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: SetUserParentDTO.Request = {
            parentUserId: req.body.parentUserId,
            userId: req.params.id || req.decoded.userId
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