import { Result } from "../../../../core/models/Result";

export interface IPartnerValidationService {
    createPartnerData<T>(data: T): Result<string | null, string | null>;
    deletePartnerData<T>(data: T): Result<string | null, string | null>;
    updatePartnerData<T>(data: T): Result<string | null, string | null>;
};