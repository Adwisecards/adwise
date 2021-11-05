import { Types } from "mongoose";
import { Repo } from "../../../../../core/models/Repo";
import { RepoError } from "../../../../../core/models/RepoError";
import { Result } from "../../../../../core/models/Result";
import { ITransaction, ITransactionModel } from "../../../models/Transaction";
import { ITransactionRepo } from "../ITransactionRepo";

export class TransactionRepo extends Repo<ITransaction, ITransactionModel> implements ITransactionRepo {
    public async findByContexts(contexts: string[], dateFrom?: Date) {
        try {
            const query: any = {
                context: {$in: contexts}
            };

            if (dateFrom) {
                query.timestamp = {$gt: dateFrom};
            }

            const transactions = await this.Model.find(query);

            return Result.ok(transactions);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findByTypeAndTo(type: string, to: string, limit?: number, page?: number) {
        try {
            const transactions = await this.Model.find({
                to: to,
                type: type
            }).limit(limit || 10000).skip(page && limit ? (page - 1) * limit : 0);
            return Result.ok(transactions);
        } catch (ex) {
            console.log(ex);
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findByTypeAndFrom(type: string, from: string, dateFrom?: Date, dateTo?: Date) {
        try {
            let query: Record<string, any> = {
                from: from,
                type: type
            };

            if (dateFrom) {
                if (!query.timestamp) query.timestamp = {};
                query.timestamp.$gte = dateFrom;
            }

            if (dateTo) {
                if (!query.timestamp) query.timestamp = {};
                query.timestamp.$lte = dateTo;
            }

            const transactions = await this.Model.find(query);

            return Result.ok(transactions);
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

                if (parameterName == 'from|to') {
                    query.$or = [{from: parameterValue}, {to: parameterValue}];
                    continue;
                }
                
                const pattern = new RegExp(`.*${parameterValue}.*`, 'i');
                const isNumber = (!!Number.parseInt(parameterValue)) && !Types.ObjectId.isValid(parameterValue) && (Number.parseInt(parameterValue)).toString().length == parameterValue.length;
                const isBool = parameterValue.toString() == 'true' || parameterValue.toString() == 'false';
                const isId = Types.ObjectId.isValid(parameterValue);
                
                const exact = isNumber || isBool || isId;
                const value = exact ? (isNumber ? Number.parseFloat(parameterValue) : (isId ? new Types.ObjectId(parameterValue) : (isBool ? parameterValue.toString() == 'true' : parameterValue))) : {$regex: pattern};

                (<any>query)[parameterName] = value;
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

            console.log(query);

            const docs = await this.Model
                // @ts-ignore
                .find(query)
                .sort({ [sortBy]: order })
                .limit(Number.parseInt(pageSize as any))
                .skip(pageSize * (pageNumber - 1))
                .populate(populate)

            return new Promise<any>(resolve => (<any>this.Model).deepPopulate(docs, 'from to from.user to.user from.organization to.organization', (error: Error, tr: ITransaction[]) => {
                if (error) return resolve(Result.fail(new RepoError(error.message, 500)));
                return resolve(Result.ok(tr));
            }))
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

                if (parameterName == 'from|to') {
                    query.$or = [{from: parameterValue}, {to: parameterValue}];
                    continue;
                }
                
                const pattern = new RegExp(`.*${parameterValue}.*`, 'i');
                const isNumber = (!!Number.parseInt(parameterValue)) && !Types.ObjectId.isValid(parameterValue) && (Number.parseInt(parameterValue)).toString().length == parameterValue.length;
                const isBool = parameterValue === 'true' || parameterValue === 'false';
                const isId = Types.ObjectId.isValid(parameterValue);
                
                const exact = isNumber || isBool || isId;
                const value = exact ? (isNumber ? Number.parseFloat(parameterValue) : (isId ? new Types.ObjectId(parameterValue) : parameterValue)) : {$regex: pattern};

                (<any>query)[parameterName] = value;
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

            const docs = await this.Model
                // @ts-ignore
                .count(query)

            return new Promise<any>(resolve => (<any>this.Model).deepPopulate(docs, 'from to from.user to.user from.organization to.organization', (error: Error, tr: ITransaction[]) => {
                if (error) return resolve(Result.fail(new RepoError(error.message, 500)));
                return resolve(Result.ok(tr));
            }))
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async searchWithType(type: string, parameterName: string, parameterValue: string, sortBy: string, order: number, pageSize: number, pageNumber: number, populate?: string) {
        try {
            const pattern = new RegExp(`.*${parameterValue}.*`, 'i');
            const isNumber = (!!Number.parseInt(parameterValue)) && !Types.ObjectId.isValid(parameterValue);
            const isBool = parameterValue === 'true' || parameterValue === 'false';
            const isId = Types.ObjectId.isValid(parameterValue);
            
            const exact = isNumber || isBool || isId;
            const value = exact ? (isNumber ? Number.parseFloat(parameterValue) : (isId ? new Types.ObjectId(parameterValue) : parameterValue)) : {$regex: pattern};

            const docs = await this.Model
                // @ts-ignore
                .find({ [parameterName]: value, type: type})
                .sort({ [sortBy]: order })
                .limit(pageSize)
                .skip(pageSize * (pageNumber - 1))
                .populate(populate)

            return Result.ok(docs);
        } catch (ex) {
            console.log(ex);
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findByFrom(from: string, dateFrom?: Date) {
        try {
            const query: any = {
                from: from
            };

            if (dateFrom) {
                query.timestamp = {$gt: dateFrom};
            }

            const transactions = await this.Model.find(query);

            return Result.ok(transactions);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findByTo(to: string, dateFrom?: Date) {
        try {
            const query: any = {
                to: to
            };

            if (dateFrom) {
                query.timestamp = {$gt: dateFrom};
            }
            
            const transactions = await this.Model.find(query).sort({timestamp: -1});

            return Result.ok(transactions);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findByType(type: string, limit: number, page: number) {
        try {
            const transactions = await this.Model.find({type: type}).limit(Number.parseInt(limit as any)).skip(limit * (page - 1));

            return Result.ok(transactions);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findByFromAndOrigin(from: string, origin: string, dateFrom?: Date, dateTo?: Date) {
        try {
            const query: any = {from: from, origin: origin};

            if (dateFrom) {
                if (!query.timestamp) query.timestamp = {};
                query.timestamp.$gte = dateFrom;
            }

            if (dateTo) {
                if (!query.timestamp) query.timestamp = {};
                query.timestamp.$lte = dateTo;
            }

            const transactions = await this.Model.find(query);

            return Result.ok(transactions);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findManyByOriginsAndTypes(origins: string[], type: string, sortBy: string, order: number, pageSize: number, pageNumber: number) {
        try {
            const transactions = await this.Model.find({origin: {$in: origins}, type})
                .limit(pageSize)
                .skip((pageNumber - 1) * pageSize)
                .sort({[sortBy]: order});

            return Result.ok(transactions);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async countManyByOriginsAndTypes(origins: string[], type: string) {
        try {
            const count = await this.Model.count({origin: {$in: origins}, type});

            return Result.ok(count);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findManyWithoutContext() {
        try {
            const transactions = await this.Model.find({
                context: {$in: ["", null]}
            });

            return Result.ok(transactions);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findManyByFrozen(frozen: boolean) {
        try {
            const transactions = await this.Model.find({
                frozen: frozen
            });

            return Result.ok(transactions);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findManyByToAndFrozenAndDisabled(to: string, frozen: boolean, disabled: boolean) {
        try {
            const transactions = await this.Model.find({
                to: to,
                frozen: frozen,
                disabled: disabled
            });

            return Result.ok(transactions);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findManyByTypeAndContext(type: string, context: string) {
        try {
            const transactions = await this.Model.find({type, context});

            return Result.ok(transactions);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async setManyDisabledByIds(ids: string[], disabled: boolean) {
        try {
            await this.Model.updateMany({_id: {$in: ids}}, {
                $set: {
                    disabled: disabled
                }
            });

            return Result.ok(true);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }
}