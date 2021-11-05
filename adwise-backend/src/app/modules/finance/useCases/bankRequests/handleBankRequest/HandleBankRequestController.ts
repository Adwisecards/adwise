import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { logger } from "../../../../../services/logger";
import { HandleBankRequestDTO } from "./HandleBankRequestDTO";

export class HandleBankRequestController extends HTTPController<HandleBankRequestDTO.Request, HandleBankRequestDTO.Response> {
    public async executeImplementation(req: Request, res: Response) {
        console.log(req.body);
        // const dto: HandlePaymentStatusDTO.Request = {
        //     amount: {
        //         currency: req.body.currency,
        //         value: req.body.valu
        //     },
        //     metadata: req.body.object.metadata,
        //     event: req.body.event,
        //     ip: req.ip,
        //     paid: req.body.object.paid
        // };

        const dto: HandleBankRequestDTO.Request = {
            ...req.body
        };

        const result = await this.useCase.execute(dto);
        if (result.isFailure) {
            logger.error(result.getError()!.stack!, result.getError()!.message);
            res.status(result.getError()!.HTTPStatus).send('FAIL');
            return;
        }

        // const data = result.getValue()!;
        // this.success(res, {data} as any, {
        //     cookies: [],
        //     headers: []
        // });
        res.status(200).send('OK');
    }
}