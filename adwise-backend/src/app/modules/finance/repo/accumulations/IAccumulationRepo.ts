import { IRepo, RepoResult } from "../../../../core/models/interfaces/IRepo";
import { IAccumulation } from "../../models/Accumulation";

export interface IAccumulationRepo extends IRepo<IAccumulation> {
    findByUserAndTypeAndClosed(userId: string, type: string, closed: boolean): RepoResult<IAccumulation>;
    findManyByClosed(closed: boolean): RepoResult<IAccumulation[]>;
    findByPayment(paymentId: string): RepoResult<IAccumulation>;
    findManyByUserAndClosed(userId: string, closed: boolean): RepoResult<IAccumulation[]>;
};