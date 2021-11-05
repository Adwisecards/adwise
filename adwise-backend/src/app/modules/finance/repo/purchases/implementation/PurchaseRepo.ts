import { Types } from "mongoose";
import { Repo } from "../../../../../core/models/Repo";
import { RepoError } from "../../../../../core/models/RepoError";
import { Result } from "../../../../../core/models/Result";
import { IPurchase, IPurchaseModel } from "../../../models/Purchase";
import { IPurchaseRepo } from "../IPurchaseRepo";

export class PurchaseRepo extends Repo<IPurchase, IPurchaseModel> implements IPurchaseRepo {
    public async findByUserAndOrganization(user: string, organization: string) {
        try {
            const organizations = await this.Model.find({
                user: user,
                organization: organization
            }).sort({timestamp: -1})
                .populate('purchaser user cashier');

            return Result.ok(organizations);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    };

    public async findByOrganization(organizationId: string, limit: number, page: number, confirmed?: boolean, dateFrom?: string, dateTo?: string, sortBy?: string, order?: number, archived?: boolean) {
        try {

            const query: any = {
                organization: organizationId,
            };

            if (confirmed != undefined) {
                (<any>query).confirmed = true;
            }

            if (dateFrom) {
                query.timestamp = {$gte: dateFrom};
            }

            if (dateTo) {
                query.timestamp = {$lte: dateTo};
            }

            if (dateTo && dateFrom) {
                query.timestamp = {$gte: dateFrom, $lte: dateTo};
            }

            if (archived != undefined) {
                query.archived = archived;
            }

            const purchases = await this.Model.find(query)
                .limit(limit)
                .skip(limit * (page - 1))
                .sort({timestamp: -1})
                .populate('purchaser user cashier')
                .sort({[sortBy!]: order});

            return Result.ok(purchases);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findByUser(userId: string, limit: number, page: number, all?: boolean) {
        try {
            const query: any = {user: userId};

            if (!all) {
                query.disabled = false;
            }

            let purchases = await this.Model.find(query)
                .limit(limit)
                .skip(limit * (page - 1))
                .sort({timestamp: -1})
                .populate('purchaser user cashier organization');

            // if (!all) {
            //     purchases = purchases.filter(p => !p.disabled);
            // }
            
            return Result.ok(purchases);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findByUserAndFilter(userId: string, limit: number, page: number, filter: Record<string, boolean>[], dateFrom?: string, dateTo?: string, refCode?: string, organizationName?: string) {
        try {
            const query: any = {user: userId};
            if (filter && filter.length) {
                query['$or'] = filter
            }

            if (dateFrom) {
                query.timestamp = {$gte: dateFrom};
            }

            if (dateTo) {
                query.timestamp = {$lte: dateTo};
            }

            if (dateTo && dateFrom) {
                query.timestamp = {$gte: dateFrom, $lte: dateTo};
            }

            if (refCode) {
                query['ref.code'] = refCode;
            }

            if (organizationName) {
                const organizationNamePattern = new RegExp(`.*${organizationName}.*`, 'ig');
                query['coupons.organizationName'] = {$regex: organizationNamePattern};
            }

            let purchases = await this.Model.find(query)
                .limit(limit)
                .skip(limit * (page - 1))
                .sort({timestamp: -1})
                .populate('purchaser user cashier organization');

            // if (!all) {
            //     purchases = purchases.filter(p => !p.disabled);
            // }
            
            return Result.ok(purchases);
        } catch (ex) {
            console.log(ex);
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async countByUserAndFilter(userId: string, filter: Record<string, boolean>[], dateFrom?: string, dateTo?: string, refCode?: string, organizationName?: string) {
        try {
            const query: any = {user: userId};
            if (filter && filter.length) {
                query['$or'] = filter
            }

            if (dateFrom) {
                query.timestamp = {$gte: dateFrom};
            }

            if (dateTo) {
                query.timestamp = {$lte: dateTo};
            }

            if (dateTo && dateFrom) {
                query.timestamp = {$gte: dateFrom, $lte: dateTo};
            }

            if (refCode) {
                query['ref.code'] = refCode;
            }

            if (organizationName) {
                const organizationNamePattern = new RegExp(`.*${organizationName}.*`, 'ig');
                query['coupons.organizationName'] = {$regex: organizationNamePattern};
            }

            let purchases = await this.Model.count(query);
            
            return Result.ok(purchases);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findByOrganizationAndFilter(organizationId: string, limit: number, page: number, filter: Record<string, boolean>[], dateFrom?: string, dateTo?: string, sortBy?: string, order?: number, refCode?: string, cashierContactId?: string, purchaserContactId?: String) {
        try {
            const query: any = {
                organization: organizationId,
            };

            if (filter && filter.length) {
                query['$or'] = filter
            }

            if (dateFrom) {
                query.timestamp = {$gte: dateFrom};
            }

            if (dateTo) {
                query.timestamp = {$lte: dateTo};
            }

            if (dateTo && dateFrom) {
                query.timestamp = {$gte: dateFrom, $lte: dateTo};
            }

            if (refCode) {
                query['ref.code'] = refCode;
            }

            if (cashierContactId) {
                query['cashier'] = cashierContactId;
            }

            if (purchaserContactId) {
                query['purchaser'] = purchaserContactId;
            }

            console.log('\n', query, '\n');

            const purchases = await this.Model.find(query)
                .limit(limit)
                .skip(limit * (page - 1))
                .sort({timestamp: -1})
                .populate('purchaser user cashier employeeRating')
                .sort({[sortBy!]: order});

            return Result.ok(purchases);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async countByOrganizationAndFilter(organizationId: string, filter: Record<string, boolean>[], dateFrom?: string, dateTo?: string, refCode?: string, cashierContactId?: string, purchaserContactId?: String) {
        try {
            const query: any = {
                organization: organizationId,
            };

            if (filter && filter.length) {
                query['$or'] = filter
            }

            if (dateFrom) {
                query.timestamp = {$gte: dateFrom};
            }

            if (dateTo) {
                query.timestamp = {$lte: dateTo};
            }

            if (dateTo && dateFrom) {
                query.timestamp = {$gte: dateFrom, $lte: dateTo};
            }

            if (refCode) {
                query['ref.code'] = refCode;
            }

            if (cashierContactId) {
                query['cashier'] = cashierContactId;
            }

            if (purchaserContactId) {
                query['purchaser'] = purchaserContactId;
            }

            const purchases = await this.Model.count(query);

            return Result.ok(purchases);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findByOrganizationAndConfirmed(organizationId: string, limit: number, page: number) {
        try {
            const purchases = await this.Model.find({
                organization: organizationId,
                confirmed: true
            })
                .limit(limit)
                .skip(limit * (page - 1))
                .sort({timestamp: -1})
                .populate('purchaser user cashier');
            
            return Result.ok(purchases);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findByCashierAndComplete(cashierId: string, complete: boolean) {
        try {
            const purchases = await this.Model.find({
                cashier: cashierId,
                complete: complete
            })
                .sort({timestamp: -1})
                .populate('purchaser user cashier organization');
            
            return Result.ok(purchases);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findManyByPurchasersAndOrganization(purchaserIds: string[], organizationId: string) {
        try {
            const purchases = await this.Model.find({
                purchaser: {$in: purchaserIds},
                organization: organizationId
            });

            return Result.ok(purchases);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findByPurchaserIdsAndOrganizationAndConfirmed(purchaserIds: string[], organizationId: string, confirmed: boolean) {
        try {
            const purchases = await this.Model.find({
                purchaser: {$in: purchaserIds},
                organization: organizationId,
                confirmed: confirmed
            }).sort({timestamp: -1});

            return Result.ok(purchases);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findManyByDateRangeAndConfirmed(dateFrom: Date, dateTo: Date, confirmed: boolean) {
        try {
            const purchases = await this.Model.find({
                timestamp: {
                    $gte: dateFrom,
                    $lte: dateTo
                },
                confirmed: confirmed
            });

            return Result.ok(purchases);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async search(parameterNames: string[], parameterValues: string[], sortBy: string, order: number, pageSize: number, pageNumber: number, populate?: string) {
        try {
            populate;

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
                    query['message'] = new RegExp(`.*${parameterValue}.*`, 'ig');
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
                const value = exact ? (isNumber ? Number.parseFloat(parameterValue) : (isId ? Types.ObjectId(parameterValue) : parameterValue.toString() == 'true')) : {$regex: pattern};
                
                (<any>query)[parameterName] = value;
            }

            const purchases = await this.Model.aggregate([
                {'$lookup': {
                    from: 'payments',
                    localField: 'payment',
                    foreignField: '_id',
                    as: 'payment'
                }},
                {'$unwind': '$payment'},
                {'$lookup': {
                    from: 'contacts',
                    localField: 'purchaser',
                    foreignField: '_id',
                    as: 'purchaser'
                }},
                {'$unwind': '$purchaser'},
                {'$lookup': {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                }},
                {'$unwind': '$user'},
                {'$lookup': {
                    from: 'contacts',
                    localField: 'cashier',
                    foreignField: '_id',
                    as: 'cashier'
                }},
                {'$unwind': '$cashier'},
                {'$lookup': {
                    from: 'organizations',
                    localField: 'organization',
                    foreignField: '_id',
                    as: 'organization'
                }},
                {'$unwind': '$organization'},
                {'$match': query},
                {'$sort': {[sortBy]: Number(order)}},
                {'$skip': (Number(pageNumber) - 1) * Number(pageSize)},
                {'$limit': Number(pageSize)}
            ]).exec();

            console.log(query);

            return Result.ok(purchases);
        } catch (ex) {
            console.log(ex);
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
                const value = exact ? (isNumber ? Number.parseFloat(parameterValue) : (isId ? new Types.ObjectId(parameterValue) : parameterValue.toString() == 'true')) : {$regex: pattern};
                
                (<any>query)[parameterName] = value;
            }

            const purchases = await this.Model.aggregate([
                {'$lookup': {
                    from: 'payments',
                    localField: 'payment',
                    foreignField: '_id',
                    as: 'payment'
                }},
                {'$unwind': '$payment'},
                {'$lookup': {
                    from: 'contacts',
                    localField: 'purchaser',
                    foreignField: '_id',
                    as: 'purchaser'
                }},
                {'$unwind': '$purchaser'},
                {'$lookup': {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                }},
                {'$unwind': '$user'},
                {'$lookup': {
                    from: 'contacts',
                    localField: 'cashier',
                    foreignField: '_id',
                    as: 'cashier'
                }},
                {'$unwind': '$cashier'},
                {'$lookup': {
                    from: 'organizations',
                    localField: 'organization',
                    foreignField: '_id',
                    as: 'organization'
                }},
                {'$unwind': '$organization'},
                {'$match': query},
                {'$count': 'purchaseCount'}
            ]).exec();

            return Result.ok((<any>purchases)[0]?.purchaseCount || 0);
        } catch (ex) {
            console.log(ex);
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async setManyArchivedByOrganizationAndConfirmedAndComplete(organizationId: string, confirmed: boolean, complete: boolean, archived: boolean) {
        try {
            await this.Model.updateMany({organization: organizationId, confirmed: confirmed, complete: complete}, {
                $set: {
                    archived: archived
                }
            });

            return Result.ok(true);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async setManyArchivedByOrganization(organizationId: string, archived: boolean) {
        try {
            await this.Model.updateMany({organization: organizationId}, {
                $set: {
                    archived: archived
                }
            });

            return Result.ok(true);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findManyByCoupons(couponIds: string[]) {
        try {
            const purchases = await this.Model.find({
                'coupons._id': {$in: couponIds}
            });

            return Result.ok(purchases);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }
}