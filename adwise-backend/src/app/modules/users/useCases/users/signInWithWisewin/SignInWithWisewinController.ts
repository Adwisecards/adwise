import { Request, Response } from "express";
import ms from "ms";
import { HTTPController } from "../../../../../core/models/HTTPController";
import { configProps } from "../../../../../services/config";
import { SignInWithWisewinDTO } from "./SignInWithWisewinDTO";

export class SignInWithWisewinController extends HTTPController<SignInWithWisewinDTO.Request, SignInWithWisewinDTO.Response> {
    protected async executeImplementation(req: Request, res: Response) {
        try {
            const dto: SignInWithWisewinDTO.Request = {
                authToken: req.body.authToken,
                ipAddress: req.ip,
                wisewinId: req.query.id || undefined as any
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
        } catch (ex) {
            console.log(ex);
        }
    }
}