import MyRegexp from "myregexp";
import { Repo } from "../../../../../core/models/Repo";
import { RepoError } from "../../../../../core/models/RepoError";
import { Result } from "../../../../../core/models/Result";
import { IUser, IUserModel } from "../../../models/User";
import { IUserRepo } from "../IUserRepo";

export class UserRepo extends Repo<IUser, IUserModel> implements IUserRepo {
    public async findByEmail(email: string) {
        try {
            email = email.toLowerCase();
            const doc = await this.Model.findOne({ email: email });
            if (!doc) {
                return Result.fail(new RepoError('Not found', 404));
            }

            return Result.ok(doc);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findByWinwiseId(id: string) {
        try {
            const doc = await this.Model.findOne({ wisewinId: id });
            if (!doc) {
                return Result.fail(new RepoError('Not found', 404));
            }

            return Result.ok(doc);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findByPushToken(pushToken: string) {
        try {
            const doc = await this.Model.findOne({ pushToken: pushToken });
            if (!doc) {
                return Result.fail(new RepoError('Not found', 404));
            }

            return Result.ok(doc);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findByPushTokenBusiness(pushTokenBusiness: string) {
        try {
            const doc = await this.Model.findOne({ pushTokenBusiness: pushTokenBusiness });
            if (!doc) {
                return Result.fail(new RepoError('Not found', 404));
            }

            return Result.ok(doc);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findByDeviceToken(deviceToken: string) {
        try {
            const doc = await this.Model.findOne({ deviceToken: deviceToken });
            if (!doc) {
                return Result.fail(new RepoError('Not found', 404));
            }

            return Result.ok(doc);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findByDeviceTokenBusiness(deviceTokenBusiness: string) {
        try {
            const doc = await this.Model.findOne({ deviceTokenBusiness: deviceTokenBusiness });
            if (!doc) {
                return Result.fail(new RepoError('Not found', 404));
            }

            return Result.ok(doc);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findByPhone(phone: string) {
        try {
            phone = phone.replace(MyRegexp.phoneFormat(), '');
            const phoneRegex = new RegExp('.*'+phone.slice(2)+'$', 'ig');

            const doc = await this.Model.findOne({ phone: {$regex: phoneRegex} });
            if (!doc) {
                return Result.fail(new RepoError('Not found', 404));
            }

            return Result.ok(doc);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findByWallet(walletId: string) {
        try {
            const user = await this.Model.findOne({wallet: walletId});
            if (!user) {
                return Result.fail(new RepoError('User does not exist', 404));
            }

            return Result.ok(user);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findByParent(parentId: string) {
        try {
            const users = await this.Model.find({parent: parentId});

            return Result.ok(users);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async populate(doc: IUser, field: string, projection: string) {
        try {
            return new Promise<any>(resolve => (<any>this.Model).deepPopulate(doc, field, projection, (error: Error, user: IUser) => {
                if (error) return resolve(Result.fail(new RepoError(error.message, 500)));
                return resolve(Result.ok(user));
            }))
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findByRefCode(refCode: string) {
        try {
            const user = await this.Model.findOne({'ref.code': refCode});
            if (!user) {
                return Result.fail(new RepoError('User does not exist', 404));
            }

            return Result.ok(user);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async getUserTree(userId: string) {
        try {
            let user = await this.Model.findOne({
                _id: userId
            });

            return new Promise<any>(resolve => (<any>this.Model).deepPopulate(user, 'parent parent.parent parent.parent.parent parent.parent.parent.parent parent.parent.parent.parent.parent parent.parent.parent.parent.parent.parent parent.parent.parent.parent.parent.parent.parent parent.parent.parent.parent.parent.parent.parent.parent parent.parent.parent.parent.parent.parent.parent.parent.parent parent.parent.parent.parent.parent.parent.parent.parent.parent.parent parent.parent.parent.parent.parent.parent.parent.parent.parent.parent.parent', (error: Error, user: IUser) => {
                if (error) return resolve(Result.fail(new RepoError(error.message, 500)));
                return resolve(Result.ok(user))
            }));

            
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }
}