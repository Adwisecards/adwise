import { Result } from "../../../../../core/models/Result";

export interface ILegalValidationService {
    getOrganizationLegalData<T>(data: T): Result<string | null, string | null>;
    createIndividualLegal<T>(data: T): Result<string | null, string | null>;
    createIpLegal<T>(data: T): Result<string | null, string | null>;
    createOOOLegal<T>(data: T): Result<string | null, string | null>;
    updateLegalData<T>(data: T): Result<string | null, string | null>;
    getOrganizationLegalsData<T>(data: T): Result<string | null, string | null>;

    updateIndividualLegalInfo<T>(data: T): Result<string | null, string | null>;
    updateIpLegalInfo<T>(data: T): Result<string | null, string | null>;
    updateOOOLegalInfo<T>(data: T): Result<string | null, string | null>;

    checkLegalInnData<T>(data: T): Result<string | null, string | null>;
};