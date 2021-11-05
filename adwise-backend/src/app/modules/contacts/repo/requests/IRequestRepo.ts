import { IRepo, RepoResult } from "../../../../core/models/interfaces/IRepo";
import { IRequest } from "../../models/Request";

export interface IRequestRepo extends IRepo<IRequest> {
    findRequestsByContact(id: string): RepoResult<IRequest[]>;
};