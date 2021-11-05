import { Repo } from "../../../../core/models/Repo";
import { IMedia, IMediaModel } from "../../models/Media";
import { IMediaRepo } from "../IMediaRepo";

export class MediaRepo extends Repo<IMedia, IMediaModel> implements IMediaRepo {

}