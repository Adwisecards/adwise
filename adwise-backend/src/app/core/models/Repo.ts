import { IRepo } from "./interfaces/IRepo";
import { Model, Document, Types } from 'mongoose';
import { Result } from "./Result";
import { RepoError } from "./RepoError";
import { DbSaveErrorModel } from "./dbSaveError";

export abstract class Repo<D extends Document, M extends Model<D>> implements IRepo<D> {
    protected Model: M;
    constructor(Model: M) {
        this.Model = Model;
    }

    public async save(doc: D, count = 1, error?: string) {
        try {
            if (count == 3) {
                const saveError = new DbSaveErrorModel({
                    object: doc.toObject(),
                    error: error
                });

                await saveError.save();
                throw new Error(error);
            }

            await doc.save();
            return Result.ok(doc);
        } catch (ex) {
            if (count < 3) this.save(doc, count+1, ex.message);
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findById(id: string) {
        try {
            const doc = await this.Model.findById(id);
            if (!doc) {
                return Result.fail(new RepoError('Not found', 404));
            }

            return Result.ok(doc);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async search(parameterNames: string[], parameterValues: string[], sortBy: string, order: number, pageSize: number, pageNumber: number, populate?: string) {
        try {
            const query: any = {};
            for (const index in parameterNames) {
                const parameterName = parameterNames[index];
                const parameterValue = parameterValues[index];
                
                if (parameterName == 'dateFrom') {
                    if (!query.timestamp) query.timestamp = {};
                    query.timestamp.$gte = new Date(parameterValue);
                    continue;
                }

                if (parameterName == 'dateTo') {
                    if (!query.timestamp) query.timestamp = {};
                    query.timestamp.$lte = new Date(parameterValue);
                    continue;
                }

                if (parameterName == 'phone') {
                    query.phone = new RegExp(`.*${parameterValue}.*`, 'ig');
                    continue;
                }

                if (parameterName == 'fullName') {
                    query.$or = [{firstName: new RegExp('.*' + parameterValue + '.*', 'ig')}, {lastName: new RegExp('.*' + parameterValue + '.*', 'ig')}];
                    continue;
                }

                if (parameterName == 'parentExists' && parameterValue == '1') {
                    query.parent = {$ne: undefined};
                    continue;
                }

                if (parameterName == 'ref.code' || parameterName == 'requestRef.code') {
                    query['ref.code'] = parameterValue;
                    continue;
                }

                if (parameterName == 'code') {
                    query['code'] = parameterValue;
                    continue;
                }

                if (parameterName == 'message') {
                    query['message'] = new RegExp(`.*${parameterValue}.*`, 'ig');;
                    continue;
                }

                if (query.$or) {
                    for (const key in query) {
                        if (key == '$or') continue;
    
                        for (const obj of query.$or) {
                            obj[key] = query[key];
                        }
    
                        delete query[key];
                    }
                }

                const pattern = new RegExp(`.*${parameterValue}.*`, 'i');
                const isNumber = (!!Number.parseInt(parameterValue)) && !Types.ObjectId.isValid(parameterValue);
                const isBool = parameterValue.toString() == 'true' || parameterValue.toString() == 'false';
                const isId = Types.ObjectId.isValid(parameterValue);
                
                const exact = isNumber || isBool || isId;
                const value = exact ? (isNumber ? Number.parseFloat(parameterValue) : (isId ? new Types.ObjectId(parameterValue) : parameterValue)) : {$regex: pattern};
                
                (<any>query)[parameterName] = value;
            }

            let docs: D[] = [];

            console.log('query', query);

            if ((<any>this.Model).deepPopulate) {
                docs = await this.Model
                    .find(query)
                    .sort({ [sortBy]: order })
                    .limit(Number.parseInt(pageSize as any))
                    .skip(pageSize * (pageNumber - 1));
                
                return new Promise<any>(resolve => (<any>this.Model).deepPopulate(docs, populate, (error: Error, docs: D[]) => {
                    if (error) return resolve(Result.fail(new RepoError(error.message, 500)));
                    return resolve(Result.ok(docs));
                }));
            } else {
                docs = await this.Model
                // @ts-ignore
                    .find(query)
                    .sort({ [sortBy]: order })
                    .limit(Number.parseInt(pageSize as any))
                    .skip(pageSize * (pageNumber - 1))
                    .populate(populate)
            }

            return Result.ok(docs);
        } catch (ex) {
            console.log(ex);
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async getAll() {
        try {
            const docs = await this.Model.find();
            return Result.ok(docs);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async deleteById(id: string) {
        try {
            const result = await this.Model.findByIdAndRemove(id);
            return Result.ok(result);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async deleteByIds(ids: string[]) {
        try {
            const result = await this.Model.deleteMany({_id: {$in: ids}});
            return Result.ok(result);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async populate(d: D, field: string, projection: string) {
        try {
            const docPopulated = await d.populate(field, projection);
            return Result.ok(docPopulated);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async count(parameterNames: string[], parameterValues: string[]) {
        try {
            const query: any = {};
            for (const index in parameterNames) {
                const parameterName = parameterNames[index];
                const parameterValue = parameterValues[index];
                
                if (parameterName == 'dateFrom') {
                    if (!query.timestamp) query.timestamp = {};
                    query.timestamp.$gte = new Date(parameterValue);
                    continue;
                }

                if (parameterName == 'dateTo') {
                    if (!query.timestamp) query.timestamp = {};
                    query.timestamp.$lte = new Date(parameterValue);
                    continue;
                }

                if (parameterName == 'phone') {
                    query.phone = new RegExp(`.*${parameterValue}.*`, 'i');
                    continue;
                }

                if (parameterName == 'parentExists' && parameterValue == '1') {
                    query.parent = {$ne: undefined};
                    continue;
                }

                if (parameterName == 'ref.code' || parameterName == 'requestRef.code') {
                    query['ref.code'] = parameterValue;
                    continue;
                }

                const pattern = new RegExp(`.*${parameterValue}.*`, 'i');
                const isNumber = (!!Number.parseInt(parameterValue)) && !Types.ObjectId.isValid(parameterValue);
                const isBool = parameterValue.toString() == 'true' || parameterValue.toString() == 'false';
                const isId = Types.ObjectId.isValid(parameterValue);
                
                const exact = isNumber || isBool || isId;
                const value = exact ? (isNumber ? Number.parseFloat(parameterValue) : (isId ? new Types.ObjectId(parameterValue) : parameterValue)) : {$regex: pattern};
                
                (<any>query)[parameterName] = value;
            }

            const count = await this.Model
                // @ts-ignore
                .count(query)

            return Result.ok(count);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findByIds(ids: string[]) {
        try {
            const docs = await this.Model.find({_id: {$in: ids}});

            return Result.ok(docs);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }
}