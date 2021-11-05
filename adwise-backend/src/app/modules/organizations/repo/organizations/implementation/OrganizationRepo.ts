import { Types } from "mongoose";
import { Repo } from "../../../../../core/models/Repo";
import { RepoError } from "../../../../../core/models/RepoError";
import { Result } from "../../../../../core/models/Result";
import { IOrganization, IOrganizationModel } from "../../../models/Organization";
import { IOrganizationRepo } from "../IOrganizationRepo";

export class OrganizationRepo extends Repo<IOrganization, IOrganizationModel> implements IOrganizationRepo {
    public async findByInn(inn: string) {
        try {
            const organization = await this.Model.findOne({$or: [
                {inn: inn},
                {'legal.info.inn': inn}
            ]});

            if (!organization) {
                return Result.fail(new RepoError('Organization does not exist', 404));
            }

            return Result.ok(organization);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }
    
    public async findOrganizations(search: string, city: string, categoryIds: string[], limit: number, page: number) {
        try {
            search = search || '.';
            city = city || '.';

            const searchPattern = new RegExp('.*'+search+'.*', 'igs');
            const cityPattern = new RegExp('.*'+city+'.*', 'igs');

            const categoryFilter: Record<string, any> = {};

            if (categoryIds && categoryIds.length) {
                categoryFilter['category._id'] = {$in: categoryIds};
            }

            const organizations = await this.Model.find(categoryFilter).or([
                    {$or: [
                        {name: {$regex: searchPattern}},
                        {tags: {$elemMatch: {name: {$in: [searchPattern]}}}},
                        {'category.name': {$regex: searchPattern}},
                    ], 
                        disabled: false,
                        'address.city': {$regex: cityPattern}
                    },
                    {$or: [
                        {name: {$regex: searchPattern}},
                        {tags: {$elemMatch: {name: {$in: [searchPattern]}}}},
                        {'category.name': {$regex: searchPattern}},
                    ], 
                        disabled: false,
                        availableGlobally: true
                    }
                ])
            .limit(limit)
            .skip(limit * (page - 1))

            return Result.ok(organizations);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findByCategory(category: string) {
        try {
            const organizations = await this.Model.find({'category.name': category});

            return Result.ok(organizations);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findByManager(managerId: string) {
        try {
            const organizations = await this.Model.find({manager: managerId}).populate('wallet');
            
            return Result.ok(organizations);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findByUser(userId: string) {
        try {
            const organization = await this.Model.findOne({user: userId});
            if (!organization) {
                return Result.fail(new RepoError('Organization is not found', 404));
            }
            
            return Result.ok(organization);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findByWallet(walletId: string) {
        try {
            const organization = await this.Model.findOne({wallet: walletId});
            if (!organization) {
                return Result.fail(new RepoError('Organization is not found', 404));
            }

            return Result.ok(organization);

        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async searchByIds(ids: string[], search: string, categoryIds: string[], sortBy: string, order: number, limit: number, page: number) {
        try {
            // const organizations = await this.Model.find({
            //     _id: {$in: ids}
            // })
            //     .skip((page - 1) * limit)
            //     .limit(limit)
            //     .sort({[sortBy]: order});

            const searchPattern = new RegExp(`.*${search}.*`, 'ig');

            const categoryFilter: Record<string, any> = {};

            if (categoryIds && categoryIds.length) {
                categoryFilter['category._id'] = {$in: categoryIds.map(i => new Types.ObjectId(i))};
            }

            
            
            const organizations = await this.Model.aggregate([
                {'$match': {
                    '_id': {'$in': ids.map(i => new Types.ObjectId(i))},
                }},
                {'$match': {
                    name: {$regex: searchPattern},
                    ...categoryFilter
                }},
                {'$lookup': {
                    from: 'coupons',
                    // localField: '_id',
                    // foreignField: 'organization',
                    as: 'coupons',
                    let: {'organizationId': '$_id'},
                    pipeline: [
                        {'$match': {
                            $expr: {$eq: ['$organization', '$$organizationId']},
                            disabled: false
                        }}
                    ]
                }},
                {'$lookup': {
                    from: 'clients',
                    // localField: '_id',
                    // foreignField: 'organization',
                    as: 'clients',
                    let: {'organizationId': '$_id'},
                    pipeline: [
                        {'$match': {
                            $expr: {$eq: ['$organization', '$$organizationId']},
                            disabled: false
                        }}
                    ]
                }},
                {'$set': {
                    'clientLength': {'$size': '$clients'},
                    'couponLength': {'$size': '$coupons'}
                }},
                {'$sort': {[sortBy]: order}},
                {'$skip': (page - 1) * limit},
                {'$limit': limit},
                {'$sort': {[sortBy]: order}}
            ]).exec();


            return Result.ok(organizations);
        } catch (ex) {
            console.log(ex);
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async countByIds(ids: string[], search: string, categoryIds: string[]) {
        try {
            // const organizations = await this.Model.find({
            //     _id: {$in: ids}
            // })
            //     .skip((page - 1) * limit)
            //     .limit(limit)
            //     .sort({[sortBy]: order});

            const searchPattern = new RegExp(`.*${search}.*`, 'ig');

            const categoryFilter: Record<string, any> = {};

            if (categoryIds && categoryIds.length) {
                categoryFilter['category._id'] = {$in: categoryIds.map(i => new Types.ObjectId(i))};
            }

            const organizations = await this.Model.aggregate([
                {'$match': {
                    '_id': {'$in': ids.map(i => new Types.ObjectId(i))},
                }},
                {'$match': {
                    name: {$regex: searchPattern},
                    ...categoryFilter
                }},
                {'$count': 'organizationCount'}
            ]).exec();


            return Result.ok(organizations[0]?.organizationCount || 0);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }
}