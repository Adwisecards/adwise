import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetContactsDTO } from "./GetContactsDTO";

export class GetContactsController extends HTTPController<GetContactsDTO.Request, GetContactsDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetContactsDTO.Request = {
            contacts: req.body.contacts
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