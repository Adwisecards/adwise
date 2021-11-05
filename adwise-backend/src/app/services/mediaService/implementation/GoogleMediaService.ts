import { Storage } from '@google-cloud/storage';
import { IMediaService } from '../IMediaService';
import stream from 'stream';
import { Result } from '../../../core/models/Result';
import {v4} from 'uuid';

export class GoogleMediaService implements IMediaService {
    private storage: Storage;
    private bucketName: string;
    private bucketUrl: string;
    private bucketFolder: string;

    constructor(filename: string, bucketName: string, bucketUrl: string, bucketFolder: string) {
        this.storage = new Storage({keyFilename: filename});
        this.bucketName = bucketName;
        this.bucketUrl = bucketUrl;
        this.bucketFolder = bucketFolder;
    }

    public getAbsolutePath(filename: string) {
        return `${this.bucketUrl}/${this.bucketFolder}/${filename}`;
    }

    public async get(filename: string): Promise<Result<Buffer | null, Error | null>> {
        try {
            const response = await this.storage.bucket(this.bucketName).file(this.bucketFolder+'/'+filename).download();

            return Result.ok(response[0]);
        } catch (ex) {
            console.log(ex);
            return Result.fail(ex);
        }
    }

    public save(filename: string, data: Buffer): Promise<Result<string | null, Error | null>> {
        return new Promise((resolve, _) => {
            const splitFilename = filename.split('.');
            filename = this.bucketFolder+'/'+v4()+'.'+splitFilename[splitFilename.length-1];

            const bucket = this.storage.bucket(this.bucketName);
            const dataStream = new stream.PassThrough();
            
            const gcFile = bucket.file(filename);

            dataStream.push(data);
            dataStream.push(null);

            dataStream.pipe(gcFile.createWriteStream({
                resumable: false,
                validation: false,
                metadata: {'Cache-Control': 'public, max-age=31536000'}
            }))
                .on('error', (ex) => {
                    return resolve(Result.fail(ex));
                })
                .on('finish', () => {
                    filename = this.bucketUrl+'/'+filename;
                    return resolve(Result.ok(filename));
                });
        });
    }
}