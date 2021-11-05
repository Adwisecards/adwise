import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { GetOrganizationCouponsDTO } from "./GetOrganizationCouponsDTO";

export class GetOrganizationCouponsController extends HTTPController<GetOrganizationCouponsDTO.Request, GetOrganizationCouponsDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        const dto: GetOrganizationCouponsDTO.Request = {
            limit: Number.parseInt(req.query.limit as string) as number || 10,
            page: Number.parseInt(req.query.page as string) || 1,
            organizationId: req.params.id,
            all: req.query.all == '1',
            type: req.query.type as string,
            disabled: req.query.disabled == '1',
            export: req.query.export == '1'
        };

        const result = await this.useCase.execute(dto);
        if (result.isFailure) {
            return this.handleError(res, result.getError()!);
        }

        const data = result.getValue()!;

        if (dto.export) {
            res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-disposition', 'attachment; filename=data.xlsx');
            res.send(data.coupons);
            return;
        }

        this.success(res, {data}, {
            cookies: [],
            headers: []
        });
    }
}
