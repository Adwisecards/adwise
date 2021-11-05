import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IWallet } from "../../../models/Wallet";

export namespace GetWalletDTO {
    export interface Request {
        userId: string;
        organization: boolean;
    };

    export interface ResponseData {
        wallet: IWallet;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};