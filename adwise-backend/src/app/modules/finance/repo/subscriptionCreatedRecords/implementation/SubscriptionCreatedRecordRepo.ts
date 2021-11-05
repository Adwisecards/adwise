import { Types } from "mongoose";
import { Repo } from "../../../../../core/models/Repo";
import { RepoError } from "../../../../../core/models/RepoError";
import { Result } from "../../../../../core/models/Result";
import { ISubscriptionCreatedRecord, ISubscriptionCreatedRecordModel } from "../../../models/SubscriptionCreatedRecord";
import { ISubscriptionCreatedRecordRepo } from "../ISubscriptionCreatedRecordRepo";

export class SubscriptionCreatedRecordRepo extends Repo<ISubscriptionCreatedRecord, ISubscriptionCreatedRecordModel> implements ISubscriptionCreatedRecordRepo {
    // public async search(parameterNames: string[], parameterValues: string[], sortBy: string, order: number, pageSize: number, pageNumber: number, populate?: string) {
    //     try {
    //         const query: any = {};
    //         for (const index in parameterNames) {
    //             const parameterName = parameterNames[index];
    //             const parameterValue = parameterValues[index];
                
    //             if (parameterName == 'dateFrom') {
    //                 query.timestamp = {$gte: new Date(parameterValue)};
    //                 continue;
    //             }

    //             if (parameterName == 'dateTo') {
    //                 query.timestamp = {$lte: new Date(parameterValue)};
    //                 continue;
    //             }

    //             const pattern = new RegExp(`.*${parameterValue}.*`, 'i');
    //             const isNumber = (!!Number.parseInt(parameterValue)) && !Types.ObjectId.isValid(parameterValue);
    //             const isBool = parameterValue === 'true' || parameterValue === 'false';
    //             const isId = Types.ObjectId.isValid(parameterValue);
                
    //             const exact = isNumber || isBool || isId;
    //             const value = exact ? (isNumber ? Number.parseFloat(parameterValue) : (isId ? new Types.ObjectId(parameterValue) : parameterValue)) : {$regex: pattern};
                
    //             (<any>query)[parameterName] = value;
    //         }

    //         console.log(query);

    //         const docs = await this.Model
    //             // @ts-ignore
    //             .find(query)
    //             .sort({ [sortBy]: order })
    //             .limit(Number.parseInt(pageSize as any))
    //             .skip(pageSize * (pageNumber - 1))

    //         return new Promise<any>(resolve => (<any>this.Model).deepPopulate(docs, populate, (error: Error, subs: ISubscriptionCreatedRecord[]) => {
    //             if (error) return resolve(Result.fail(new RepoError(error.message, 500)));
    //             return resolve(Result.ok(subs));
    //         }))
    //     } catch (ex) {

    //     }
    // }
}