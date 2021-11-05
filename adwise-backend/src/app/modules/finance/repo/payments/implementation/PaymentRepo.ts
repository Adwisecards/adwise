import { Repo } from "../../../../../core/models/Repo";
import { RepoError } from "../../../../../core/models/RepoError";
import { Result } from "../../../../../core/models/Result";
import { IPayment, IPaymentModel } from "../../../models/Payment";
import { IPaymentRepo } from "../IPaymentRepo";

export class PaymentRepo extends Repo<IPayment, IPaymentModel> implements IPaymentRepo {
    public async findManyByRefsAndPaid(refs: string[], paid: boolean) {
        try {
            const payments = await this.Model.find({ref: {$in: refs}, paid: paid});

            return Result.ok(payments);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }
}