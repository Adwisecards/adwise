import { Result } from "../../../../../core/models/Result";

export interface IPacketValidationService {
    createPacketData<T>(data: T): Result<string | null, string | null>;
    setPacketData<T>(data: T): Result<string | null, string | null>;
    updatePacketData<T>(data: T): Result<string | null, string | null>;
    chooseWisewinOptionPacketData<T>(data: T): Result<string | null, string | null>;
    addPacketToOrganizationData<T>(data: T): Result<string | null, string | null>;
    requestPacketData<T>(data: T): Result<string | null, string | null>;
};