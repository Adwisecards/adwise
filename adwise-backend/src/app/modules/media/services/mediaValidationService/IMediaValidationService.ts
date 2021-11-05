import { Result } from "../../../../core/models/Result";

export interface IMediaValidationService {
    createMediaData<T>(data: T): Result<string | null, string | null>;
    getMediaDataData<T>(data: T): Result<string | null, string | null>;
    getMediaData<T>(data: T): Result<string | null, string | null>;
};