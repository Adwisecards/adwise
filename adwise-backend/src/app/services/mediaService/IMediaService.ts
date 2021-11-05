import { Result } from "../../core/models/Result";

export interface IMediaService {
    save(filename: string, data: Buffer): Promise<Result<string | null, Error | null>>;
    get(filename: string): Promise<Result<Buffer | null, Error | null>>;
    getAbsolutePath(filename: string): string;
};