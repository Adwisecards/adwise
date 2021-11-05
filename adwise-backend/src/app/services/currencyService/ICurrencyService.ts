import { Result } from "../../core/models/Result";

export interface ICurrencyService {
    exchange(from: string, to: string, date?: Date): Promise<Result<number | null, number | null>>;
};