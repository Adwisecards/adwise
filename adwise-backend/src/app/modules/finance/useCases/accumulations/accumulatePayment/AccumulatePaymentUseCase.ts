import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IGlobal } from "../../../../administration/models/Global";
import { IGlobalRepo } from "../../../../administration/repo/globals/IGlobalRepo";
import { AccumulationModel, IAccumulation } from "../../../models/Accumulation";
import { IPayment } from "../../../models/Payment";
import { IAccumulationRepo } from "../../../repo/accumulations/IAccumulationRepo";
import { IPaymentRepo } from "../../../repo/payments/IPaymentRepo";
import { IAccumulationValidationService } from "../../../services/accumulations/accumulationValidationService/IAccumulationValidationService";
import { AccumulatePaymentDTO } from "./AccumulatePaymentDTO";
import { accumulatePaymentErrors } from "./accumulatePaymentErrors";

export class AccumulatePaymentUseCase implements IUseCase<AccumulatePaymentDTO.Request, AccumulatePaymentDTO.Response> {
    private globalRepo: IGlobalRepo;
    private paymentRepo: IPaymentRepo;
    private accumulationRepo: IAccumulationRepo;
    private accumulationValidationService: IAccumulationValidationService;

    public errors = accumulatePaymentErrors;

    constructor(
        globalRepo: IGlobalRepo,
        paymentRepo: IPaymentRepo,
        accumulationRepo: IAccumulationRepo, 
        accumulationValidationService: IAccumulationValidationService
    ) {
        this.globalRepo = globalRepo;
        this.paymentRepo = paymentRepo;
        this.accumulationRepo = accumulationRepo;
        this.accumulationValidationService = accumulationValidationService;
    }

    public async execute(req: AccumulatePaymentDTO.Request): Promise<AccumulatePaymentDTO.Response> {
        const valid = this.accumulationValidationService.createAccumulationData(req);
        if (valid.isFailure) {
            console.log(valid);
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const globalGotten = await this.globalRepo.getGlobal();
        if (globalGotten.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting global'));
        }

        const global = globalGotten.getValue()!;

        const accumulationFound = await this.accumulationRepo.findByUserAndTypeAndClosed(req.userId, req.type, false);

        if (accumulationFound.isFailure && accumulationFound.getError()!.code == 500) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding accumulation'));
        }

        let accumulation: IAccumulation;
        
        if (accumulationFound.isFailure && accumulationFound.getError()!.code == 404) {
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + global.paymentRetention);
            accumulation = new AccumulationModel({
                accumulationId: req.accumulationId,
                sum: req.sum,
                type: req.type,
                user: req.userId,
                dueDate: dueDate
            });
        } else {
            accumulation = accumulationFound.getValue()!;

            accumulation.sum += req.sum;
        }

        const paymentIndex = accumulation.payments.findIndex(p => p.toString() == req.paymentId);
        if (paymentIndex == -1) {
            accumulation.payments.push(new Types.ObjectId(req.paymentId));
        }

        const paymentIds = accumulation.payments.map(p => p.toString());

        const paymentsFound = await this.paymentRepo.findByIds(paymentIds);
        if (paymentsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding payments'));
        }

        const payments = paymentsFound.getValue()!;

        const accumulationSum = payments.reduce((sum, cur) => sum += cur.sum, 0);

        accumulation.sum = accumulationSum;

        const accumulationSaved = await this.accumulationRepo.save(accumulation);
        if (accumulationSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving accumulation'));
        }

        return Result.ok({accumulation});
    }
}