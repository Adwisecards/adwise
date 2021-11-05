declare namespace Express {
    export interface Request {
        decoded: import('../../src/app/modules/users/models/JWT').IJWTPayload
    }
}