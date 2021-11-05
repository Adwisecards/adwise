import { Request, Response, NextFunction } from 'express';

export interface IMiddleware {
    apply(req: Request, res: Response, next: NextFunction): void
}