import { Types } from "mongoose";
import { Repo } from "../../../../../core/models/Repo";
import { RepoError } from "../../../../../core/models/RepoError";
import { Result } from "../../../../../core/models/Result";
import { IClient, IClientModel } from "../../../models/Client";
import { IClientRepo } from "../IClientRepo";

export class ClientRepo extends Repo<IClient, IClientModel> implements IClientRepo {
    public async findByOrganizationAndUser(organizationId: string, userId: string) {
        try {
            const client = await this.Model.findOne({
                user: userId,
                organization: organizationId
            });

            if (!client) {
                return Result.fail(new RepoError('Client does not exist', 404));
            }
            
            return Result.ok(client);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findByOrganization(organizationId: string, limit: number, page: number, sortBy?: string, order?: number) {
        try {
            const query = {
                organization: organizationId,
            };

            const client = await this.Model.find(query)
                .limit(limit)
                .skip(limit * (page - 1))
                .populate('contact')
                .sort({[sortBy!]: order});
            
            return Result.ok(client);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async searchByOrganization(organizationId: string, search: string, limit: number, page: number, sortBy?: string, order?: number) {
        try {

            const searchPattern = new RegExp(`.*${search}.*`, 'ig');
            // { '$or': [{firstName: {'$regex': searchPattern}}, {lastName: {'$regex': searchPattern}}]}

            const clients = await this.Model.aggregate([
                // {'$unwind': '$user'}
                // {'$lookup': {
                //     from: 'users',
                //     localField: 'user',
                //     foreignField: '_id',
                //     as: 'user'
                // }},
                { '$lookup': {
                    from: 'contacts',
                    localField: 'contact',
                    foreignField: '_id',
                    as: 'contact'
                }},
                // { '$unwind': '$user'},
                { '$unwind': '$contact'},
                { '$set': {
                    fullName: {'$concat': ['$contact.firstName.value', ' ', '$contact.lastName.value']}
                }},
                { '$match': {
                    '$or': [
                        {'fullName': {'$regex': searchPattern}}, 
                        // {'contact.lastName.value': {'$regex': searchPattern}}
                    ],
                    organization: new Types.ObjectId(organizationId)
                }},
                { '$unset': 'fullName' },
                { '$sort': {[sortBy!]: order} },
                { '$skip': limit * (page - 1) },
                { '$limit': limit }
            ])

            // const query = {
            //     organization: organizationId,
            // };

            // const client = await this.Model.find(query)
            //     .limit(limit)
            //     .skip(limit * (page - 1))
            //     .populate('contact')
            //     .sort({[sortBy!]: order});
            
            return Result.ok(clients);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async deleteByOrganizationAndUser(organizationId: string, userId: string) {
        try {
            const result = await this.Model.deleteOne({
                user: userId,
                organization: organizationId
            });
            
            return Result.ok(result);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async countByOrganization(organizationId: string, search: string) {
        try {
            const searchPattern = new RegExp(`.*${search}.*`, 'ig');

            const clients = await this.Model.aggregate([

                { '$lookup': {
                    from: 'contacts',
                    localField: 'contact',
                    foreignField: '_id',
                    as: 'contact'
                }},
                // { '$unwind': '$user'},
                { '$unwind': '$contact'},
                { '$set': {
                    fullName: {'$concat': ['$contact.firstName.value', ' ', '$contact.lastName.value']}
                }},
                { '$match': {
                    '$or': [
                        {'fullName': {'$regex': searchPattern}}, 
                        // {'contact.lastName.value': {'$regex': searchPattern}}
                    ],
                    organization: new Types.ObjectId(organizationId)
                }},
                { '$unset': 'fullName'},
                { '$count': 'clientCount' }
            ])

            // const query = {
            //     organization: organizationId,
            // };

            // const client = await this.Model.find(query)
            //     .limit(limit)
            //     .skip(limit * (page - 1))
            //     .populate('contact')
            //     .sort({[sortBy!]: order});
            
            return Result.ok((<any>clients)[0]?.clientCount || 0);
        } catch (ex) {
            console.log(ex);
            return Result.fail(new RepoError(ex.message, 500));
        }
    }
}