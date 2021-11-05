import { Repo } from "../../../../../core/models/Repo";
import { RepoError } from "../../../../../core/models/RepoError";
import { Result } from "../../../../../core/models/Result";
import { IAccumulation, IAccumulationModel } from "../../../models/Accumulation";
import { IAccumulationRepo } from "../IAccumulationRepo";

export class AccumulationRepo extends Repo<IAccumulation, IAccumulationModel> implements IAccumulationRepo {
    public async findManyByUserAndClosed(userId: string, closed: boolean) {
        try {
            const accumulations = await this.Model.find({user: userId, closed: closed});

            return Result.ok(accumulations);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }
    
    public async findByUserAndTypeAndClosed(userId: string, type: string, closed: boolean) {
        try {
            const accumulation = await this.Model.findOne({
                closed: closed, 
                user: userId,
                type: type
            });

            if (!accumulation) {
                return Result.fail(new RepoError('Accumulation does not exist', 404));
            }

            return Result.ok(accumulation);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findManyByClosed(closed: boolean) {
        try {
            const accumulations = await this.Model.find({
                closed: closed
            });

            return Result.ok(accumulations);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findByPayment(paymentId: string) {
        try {
            const accumulation = await this.Model.findOne({payments: {$in: [paymentId]}});
            if (!accumulation) {
                return Result.fail(new RepoError('Accumulation does not exist', 404));
            }

            return Result.ok(accumulation);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }
}