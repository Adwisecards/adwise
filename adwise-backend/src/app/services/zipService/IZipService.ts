import { Result } from "../../core/models/Result";

export interface IZipServiceFile {
    filename: string;
    data: Buffer;
};

export interface IZipService {
    createZip(files: IZipServiceFile[]): Result<Buffer | null, Error | null>;
};