import { Request, Response } from "express";
import ms from "ms";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { configProps } from "../../../../../services/config";
import { SignInDTO } from "./SignInDTO";
import { SignInUseCase } from "./SignInUseCase";

export class SignInController extends HTTPController<SignInDTO.Request, SignInDTO.Response> {
    constructor(useCase: SignInUseCase) {
        super(useCase);
    }

    protected async executeImplementation(req: Request, res: Response) {
        const dto: SignInDTO.Request = {
            login: req.body.login,
            password: req.body.password,
            pushToken: req.body.pushToken,
            pushTokenBusiness: req.body.pushTokenBusiness,
            deviceToken: req.body.deviceToken,
            deviceTokenBusiness: req.body.deviceTokenBusiness,
            pushNotificationsEnabled: req.body.pushNotificationsEnabled,
            language: req.body.language,
            isCashier: req.query.cashier == "1",
            isClientApp: req.query.clientApp == "1",
            isCrm: req.query.crm == "1"
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