export interface IJWTPayload {
    userId: string;
    admin: boolean;
    adminGuest: boolean;
};

export type JsonWebToken = string;