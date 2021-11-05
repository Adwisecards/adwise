import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { Result } from "../../../../../core/models/Result";
import { logger } from "../../../../../services/logger";
import { paymentService } from "../../../../../services/paymentService";
import { HandlePaymentStatusDTO } from "./HandlePaymentStatusDTO";

export class HandlePaymentStatusController extends HTTPController<HandlePaymentStatusDTO.Request, HandlePaymentStatusDTO.Response> {
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

        const dto: HandlePaymentStatusDTO.Request = {
            metadata: {
                id: req.body.OrderId
            },
            amount: {
                currency: 'rub',
                value: req.body.Amount / 100
            },
            event: req.body.Status,
            ip: req.ip,
            paid: req.body.Status == paymentService.successfulStatus,
            SpAccumulationId: req.body.SpAccumulationId
        };

        const result = await this.useCase.execute(dto);
        if (result.isFailure) {
            console.log(result);
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