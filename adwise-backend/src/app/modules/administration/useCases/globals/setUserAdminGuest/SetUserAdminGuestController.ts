import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { SetUserAdminGuestDTO } from "./SetUserAdminGuestDTO";

export class SetUserAdminGuestController extends HTTPController<SetUserAdminGuestDTO.Request, SetUserAdminGuestDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: SetUserAdminGuestDTO.Request = {
            adminGuest: req.body.adminGuest,
            targetUserId: req.params.id,
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