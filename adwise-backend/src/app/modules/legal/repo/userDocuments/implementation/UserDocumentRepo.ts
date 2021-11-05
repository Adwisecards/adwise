import { Repo } from "../../../../../core/models/Repo";
import { RepoError } from "../../../../../core/models/RepoError";
import { Result } from "../../../../../core/models/Result";
import { IUserDocument, IUserDocumentModel } from "../../../models/UserDocument";
import { IUserDocumentRepo } from "../IUserDocumentRepo";

export class UserDocumentRepo extends Repo<IUserDocument, IUserDocumentModel> implements IUserDocumentRepo {
    public async findByUserAndType(userId: string, type: string) {
        try {
            const userDocument = await this.Model.findOne({user: userId, type: type}).sort({updatedAt: -1});
            if (!userDocument) {
                return Result.fail(new RepoError('User document does not exist', 404));
            }

            return Result.ok(userDocument);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findManyByUserAndType(userId: string, type?: string) {
        try {
            const query: Record<string, any> = {user: userId};

            if (type) {
                query['type'] = type;
            }

            const userDocuments = await this.Model.find(query).sort({updatedAt: -1});

            return Result.ok(userDocuments);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }
}