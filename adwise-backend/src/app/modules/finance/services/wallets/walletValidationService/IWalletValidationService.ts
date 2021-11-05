import { Result } from "../../../../../core/models/Result";

export interface IWalletValidationService {
    createWalletData<T>(data: T): Result<string | null, string | null>;
    getWalletBalanceData<T>(data: T): Result<string | null, string | null>;
    setWalletDepositData<T>(data: T): Result<string | null, string | null>;
};