import { Result } from "../../core/models/Result";

export interface IWisewinUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dob: Date;
    lastModified: Date;
    gender: string;
    picture: string;
    packageReferrerPercent: number;
    packageRewardLimit: number;
    startPackagesLeft: number;
    parentId: string;
    tariffTitle: string;
};

export interface IWisewinCheckTokenResponse {
    success: boolean;
    userId: string;
};

export interface IWisewinService {
    getUser(id: string): Promise<Result<IWisewinUser | null, Error | null>>;
    getUserByPhone(phone: string): Promise<Result<IWisewinUser | null, Error | null>>;
    getUserByEmail(email: string): Promise<Result<IWisewinUser | null, Error | null>>;
    getUsersById(ids: string[]): Promise<Result<IWisewinUser[] | null, Error | null>>;
    checkAuthToken(token: string, ip: string): Promise<Result<IWisewinCheckTokenResponse | null, Error | null>>;
};