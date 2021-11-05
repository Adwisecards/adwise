import { Result } from "../../core/models/Result";

export type passType = 'coupon' | 'contact';

export interface IWalletService {
    generateContactPass(id: string, refCode: string, firstName: string, lastName: string, activity: string, organization: string, phone: string, email: string): Promise<Result<Buffer | null, Error | null>>;
    generateCouponPass(id: string, refCode: string, coupon: string, date: Date, organization: string, sum: number): Promise<Result<Buffer | null, Error | null>>
};