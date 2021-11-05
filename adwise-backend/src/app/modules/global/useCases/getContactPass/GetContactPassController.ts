import { Request, Response } from "express";
import { HTTPController } from "../../../../core/models/HTTPController";
import { GetContactPassDTO } from "./GetContactPassDTO";

export class GetContactPassController extends HTTPController<GetContactPassDTO.Request, GetContactPassDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetContactPassDTO.Request = {
            contactId: req.params.id
        };

        const result = await this.useCase.execute(dto);
        if (result.isFailure) {
            return this.handleError(res, result.getError()!);
        }

        const data = result.getValue()!;
        
        res.setHeader('content-type', 'application/vnd.apple.pkpass');
        res.setHeader('content-disposition', 'attachment; filename=contact.pkpass');

        res.status(200).send(data.pass);
    }
}