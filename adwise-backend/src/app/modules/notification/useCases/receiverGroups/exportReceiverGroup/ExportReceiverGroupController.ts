import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { ExportReceiverGroupDTO } from "./ExportReceiverGroupDTO";

export class ExportReceiverGroupController extends HTTPController<ExportReceiverGroupDTO.Request, ExportReceiverGroupDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: ExportReceiverGroupDTO.Request = {
            receiverGroupId: req.params.id
        };

        const result = await this.useCase.execute(dto);
        if (result.isFailure) {
            return this.handleError(res, result.getError()!);
        }

        const { data } = result.getValue()!;

        
        res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-disposition', 'attachment; filename=receiver-group.xlsx');
        res.send(data);
    }
}