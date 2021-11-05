import { IMediaService } from "../IMediaService";
import fs from 'fs';
import path from 'path';
import { Result } from "../../../core/models/Result";
import { configProps } from "../../config";

export class FileMediaService implements IMediaService {
    private path: string;
    constructor(path: string) {
        this.path = path;
    }

    public async save(filename: string, data: Buffer) {
        try {
            const now = new Date().getTime();
            fs.appendFileSync(path.join(this.path, now+filename.replace(' ', '')), data)
            
            return Result.ok(configProps.backendUrl+'/public/'+now+filename.replace(' ', ''));
        } catch (ex) {
            return Result.fail(ex);
        }
    }

    public async get(_: string) {
        return Result.ok(Buffer.alloc(1));
    }

    public getAbsolutePath(filename: string) {
        return filename;
    }
}