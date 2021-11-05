import { Result } from "../../core/models/Result";

export interface ICryptoService {
    createTransaction(walletAddress: string, amount: number): Promise<Result<string | null, Error | null>>;
};