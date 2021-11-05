import { Result } from "../../core/models/Result";

export interface IXlsxService {
    convert(data: object[]): Result<Buffer | null, Error | null>;
};