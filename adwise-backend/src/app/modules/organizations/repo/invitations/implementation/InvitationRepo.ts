import { Types } from "mongoose";
import { Repo } from "../../../../../core/models/Repo";
import { RepoError } from "../../../../../core/models/RepoError";
import { Result } from "../../../../../core/models/Result";
import { IInvitation, IInvitationModel } from "../../../models/Invitation";
import { IInvitationRepo } from "../IInvitationRepo";

export class InvitationRepo extends Repo<IInvitation, IInvitationModel> implements IInvitationRepo {
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
                    from: 'subscriptions',
                    localField: 'subscription',
                    foreignField: '_id',
                    as: 'subscription'
                }},
                {'$unwind': '$subscription'},
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
                    from: 'subscriptions',
                    localField: 'subscription',
                    foreignField: '_id',
                    as: 'subscription'
                }},
                {'$unwind': '$subscription'},
                {'$lookup': {
                    from: 'organizations',
                    localField: 'organization',
                    foreignField: '_id',
                    as: 'organization'
                }},
                {'$unwind': '$organization'},
                {'$match': query},
                {'$count': 'invitationCount'}
            ]).exec();

            return Result.ok(purchases[0]?.invitationCount || 0);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }
}