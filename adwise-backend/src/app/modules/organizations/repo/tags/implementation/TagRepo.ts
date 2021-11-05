import { Repo } from "../../../../../core/models/Repo";
import { RepoError } from "../../../../../core/models/RepoError";
import { Result } from "../../../../../core/models/Result";
import { ITag, ITagModel } from "../../../models/Tag";
import { ITagRepo } from "../ITagRepo";

export class TagRepo extends Repo<ITag, ITagModel> implements ITagRepo {
    public async saveNew(tagNames: string[]) {
        try {
            const tags: ITag[] = [];
            for (let tagName of tagNames) {
                const tagOrError = await this.findByName(tagName);
                let tag: ITag;
                if (tagOrError.isFailure) {
                    tag = new this.Model({
                        name: tagName
                    });
                } else {
                    tag = tagOrError.getValue() as ITag;
                }
                await tag.save();
                tags.push(tag);
            }

            return Result.ok(tags);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findByName(name: string) {
        try {
            const tag = await this.Model.findOne({ name: name });
            if (!tag) {
                return Result.fail(new RepoError('Tag is not found', 404));
            }

            return Result.ok(tag);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }
};