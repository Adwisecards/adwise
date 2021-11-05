import { IZipService, IZipServiceFile } from "../IZipService";
import AdmZip from 'adm-zip';
import { Result } from "../../../core/models/Result";

export class ZipService implements IZipService {
    public createZip(files: IZipServiceFile[]): Result<Buffer | null, Error | null> {
        try {
            const zip = new AdmZip();

            for (const file of files) {
                zip.addFile(file.filename, file.data);
            }

            const buf = zip.toBuffer();

            return Result.ok(buf);
        } catch (ex) {
            return Result.fail(ex);
        }
    }
};