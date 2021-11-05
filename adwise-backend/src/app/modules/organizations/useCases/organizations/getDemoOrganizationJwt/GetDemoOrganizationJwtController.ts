import { Request, Response } from "express";
import ms from "ms";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { configProps } from "../../../../../services/config";
import { GetDemoOrganizationJwtDTO } from "./GetDemoOrganizationJwtDTO";

export class GetDemoOrganizationJwtController extends HTTPController<GetDemoOrganizationJwtDTO.Request, GetDemoOrganizationJwtDTO.Response> {
    protected async executeImplementation(_: Request, res: Response) {
        const dto: GetDemoOrganizationJwtDTO.Request = {

        };

        const result = await this.useCase.execute(dto);
        if (result.isFailure) {
            return this.handleError(res, result.getError()!);
        }

        const data = result.getValue()!;
        this.success(res, {data}, {
            cookies: [{
                key: 'authentication',
                value: data.jwt,
                options: {
                    age: ms(configProps.jwtExpriresIn),
                    httpOnly: true,
                    secure: false
                }
            }],
            headers: []
        });
    }
}