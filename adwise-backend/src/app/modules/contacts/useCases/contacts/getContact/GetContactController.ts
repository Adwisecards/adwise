import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetContactDTO } from "./GetContactDTO";

export class GetContactController extends HTTPController<GetContactDTO.Request, GetContactDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetContactDTO.Request = {
            contactId: req.params.id
        };

        const result = await this.useCase.execute(dto);
        if (result.isFailure) {
            return this.handleError(res, result.getError()!);
        }

        const data = await result.getValue()!;
        this.success(res, {data}, {
            cookies: [],
            headers: []
        });
    }
}