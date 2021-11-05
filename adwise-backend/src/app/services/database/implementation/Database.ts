import { IDatabase } from "../IDatabase";
import mongoose from 'mongoose';

export class Database implements IDatabase {
    private isProd: boolean;

    constructor(isProd: boolean) {
        this.isProd = isProd;
    }
    
    public connect(URL: string, options: any): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            mongoose.connect(URL, options);
            mongoose.connection.on('open', () => {
                resolve(mongoose.connection);
            });
            mongoose.connection.on('error', err => {
                reject(err);
            });
        });
    }

    public dropDatabase(): Promise<any> {
        if (this.isProd) {
            throw new Error('Environment is production. U stupid or dumb?');
        }

        return new Promise((resolve, reject) => {
            mongoose.connection.dropDatabase((err) => {
                if (err) {
                    reject(err);
                }

                resolve(true);
            });
        });
    }
}