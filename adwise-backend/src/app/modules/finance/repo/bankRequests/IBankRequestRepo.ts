import { IRepo, RepoResult } from "../../../../core/models/interfaces/IRepo";
import { IBankRequest } from "../../models/BankRequest";

export interface IBankRequestRepo extends IRepo<IBankRequest> {
    findByRequestId(requestId: string): RepoResult<IBankRequest>;
};