import { Response, NextFunction, Request } from 'express';
import { IJWTPayload } from '../../../../../modules/users/models/JWT';
import { IAuthService } from '../../../../../modules/users/services/authService/IAuthService';
import { IMiddleware } from '../IMiddleware';


export class Auth implements IMiddleware {
    private authService: IAuthService;
    constructor(authService: IAuthService) {
        this.authService = authService;
    }

    async apply(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.headers['authentication'] || req.cookies['authentication'];
            if (!token) {
                return res.status(403).send({ error: 'Token is not provided' });
            }

            const decodedOrError = await this.authService.decode(token);
            if (decodedOrError.isFailure) {
                res.cookie('authentication', '', {
                    expires: new Date(0)
                });
                res.setHeader('authentication', '');
                return res.status(403).send({ error: 'Token is either corrupted or expired' });
            }

            const decoded = decodedOrError.getValue() as IJWTPayload;
            req.decoded = decoded;
            return next();
        } catch (err) {
            return res.status(500).send({ error: 'Internal error' });
        }
    }

    async applyDecode(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.headers['authentication'] || req.cookies['authentication'];
            if (!token) {
                return next();
            }

            const decodedOrError = await this.authService.decode(token);
            if (decodedOrError.isFailure) {
                return next();
            }

            const decoded = decodedOrError.getValue() as IJWTPayload;
            req.decoded = decoded;
            return next();
        } catch (err) {
            return res.status(500).send({ error: 'Internal error' });
        }
    }

    async applyAdmin(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.headers['authentication'] || req.cookies['authentication'];
            if (!token) {
                return res.status(403).send({error: 'Token is not provided'});
            }

            const decodedOrError = await this.authService.decode(token);
            if (decodedOrError.isFailure) {
                res.cookie('authentication', '', {
                    expires: new Date(0)
                });
                res.setHeader('authentication', '');
                return res.status(403).send({ error: 'Token is either corrupted or expired' });
            }

            const decoded = decodedOrError.getValue() as IJWTPayload;
            if (!decoded.admin) {
                return res.status(403).send({error: 'Access forbidden as user is not admin'});
            }

            req.decoded = decoded;
            return next();
        } catch (ex) {
            return res.status(500).send({error: 'Internal error'});
        }
    }

    async applyAdminGuest(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.headers['authentication'] || req.cookies['authentication'];
            if (!token) {
                return res.status(403).send({error: 'Token is not provided'});
            }

            const decodedOrError = await this.authService.decode(token);
            if (decodedOrError.isFailure) {
                res.cookie('authentication', '', {
                    expires: new Date(0)
                });
                res.setHeader('authentication', '');
                return res.status(403).send({ error: 'Token is either corrupted or expired' });
            }

            const decoded = decodedOrError.getValue() as IJWTPayload;
            if (!decoded.adminGuest && !decoded.admin) {
                return res.status(403).send({error: 'Access forbidden as user is not admin'});
            }

            req.decoded = decoded;
            return next();
        } catch (ex) {
            return res.status(500).send({error: 'Internal error'});
        }
    }
}