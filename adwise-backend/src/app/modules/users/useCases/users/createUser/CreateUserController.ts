import { Request, Response } from "express";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { configProps } from "../../../../../services/config";
import { CreateUserDTO } from "./CreateUserDTO";
import { CreateUserUseCase } from "./CreateUserUseCase";
import ms from 'ms';

export class CreateUserController extends HTTPController<CreateUserDTO.Request, CreateUserDTO.Response> {
    constructor(useCase: CreateUserUseCase) {
        super(useCase);
    }

    protected async executeImplementation(req: Request, res: Response) {
        const dto: CreateUserDTO.Request = {
            dob: req.body.dob,
            email: req.body.email,
            phone: req.body.phone,
            firstName: req.body.firstName,
            gender: req.body.gender,
            lastName: req.body.lastName,
            pushToken: req.body.pushToken,
            pushTokenBusiness: req.body.pushTokenBusiness,
            pushNotificationsEnabled: req.body.pushNotificationsEnabled,
            deviceToken: req.body.deviceToken,
            deviceTokenBusiness: req.body.deviceTokenBusiness,
            language: req.body.language,
            organizationUser: false,
            password: req.body.password,
            noVerification: false,
            noCheck: false,
            parentRefCode: req.body.parentRefCode,
            pictureMediaId: req.body.pictureMediaId
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