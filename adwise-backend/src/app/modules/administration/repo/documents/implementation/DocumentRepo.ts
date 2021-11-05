import { Repo } from "../../../../../core/models/Repo";
import { RepoError } from "../../../../../core/models/RepoError";
import { Result } from "../../../../../core/models/Result";
import { IDocument, IDocumentModel } from "../../../models/Document";
import { IDocumentRepo } from "../IDocumentRepo";

export class DocumentRepo extends Repo<IDocument, IDocumentModel> implements IDocumentRepo {
    public async findManyByType(type: string) {
        try {
            const documents = await this.Model
                .find({type})
                .sort({index: -1});
            
            return Result.ok(documents);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }
}