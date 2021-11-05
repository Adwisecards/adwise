import { IRepo, RepoResult } from "../../../../core/models/interfaces/IRepo";
import { IVerification } from "../../models/Verification";

export interface IVerificationRepo extends IRepo<IVerification> {
    findByUser(userId: string): RepoResult<IVerification>;
}; 