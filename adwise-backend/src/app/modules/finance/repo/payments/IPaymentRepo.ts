import { IRepo, RepoResult } from "../../../../core/models/interfaces/IRepo";
import { IPayment } from "../../models/Payment";

export interface IPaymentRepo extends IRepo<IPayment> {
    findManyByRefsAndPaid(refs: string[], paid: boolean): RepoResult<IPayment[]>;
};