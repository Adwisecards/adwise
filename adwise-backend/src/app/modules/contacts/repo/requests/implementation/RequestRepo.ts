import { Types } from "mongoose";
import { Repo } from "../../../../../core/models/Repo";
import { RepoError } from "../../../../../core/models/RepoError";
import { Result } from "../../../../../core/models/Result";
import { IRequest, IRequestModel } from "../../../models/Request";
import { IRequestRepo } from "../IRequestRepo";

export class RequestRepo extends Repo<IRequest, IRequestModel> implements IRequestRepo {
    public async findRequestsByContact(id: string) {
        try {
            const requests = await this.Model.find({$or: [
                {
                    from: new Types.ObjectId(id)
                },
                {
                    to: new Types.ObjectId(id)
                }
            ]});

            return Result.ok(requests);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }
}