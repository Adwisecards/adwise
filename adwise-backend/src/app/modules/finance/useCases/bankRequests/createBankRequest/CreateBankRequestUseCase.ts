import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import BankRequestType from "../../../../../core/static/BankRequestType";
import { IPaymentService } from "../../../../../services/paymentService/IPaymentService";
import { BankRequestModel } from "../../../models/BankRequest";
import { IBankRequestRepo } from "../../../repo/bankRequests/IBankRequestRepo";
import { CreateBankRequestDTO } from "./CreateBankRequestDTO";
import { createBankRequestErrors } from "./createBankRequestErrors";

export class CreateBankRequestUseCase implements IUseCase<CreateBankRequestDTO.Request, CreateBankRequestDTO.Response> {
    private bankRequestRepo: IBankRequestRepo;
    private paymentService: IPaymentService;
    
    public errors = createBankRequestErrors;

    constructor(bankRequestRepo: IBankRequestRepo, paymentService: IPaymentService) {
        this.bankRequestRepo = bankRequestRepo;
        this.paymentService = paymentService;
    }

    public async execute(req: CreateBankRequestDTO.Request): Promise<CreateBankRequestDTO.Response> {
        if (!Types.ObjectId.isValid(req.ref)) {
            return Result.fail(UseCaseError.create('c', 'ref is not valid'));
        }

        if (!Types.ObjectId.isValid(req.customerId)) {
            return Result.fail(UseCaseError.create('c', 'customerId is not valid'));
        }

        if (!BankRequestType.isValid(req.type)) {
            return Result.fail(UseCaseError.create('c', 'type is not valid'));
        }

        const cardRequestCreated = await this.paymentService.addCard(req.customerId);
        if (cardRequestCreated.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon creating card request'));
        }

        const cardRequest = cardRequestCreated.getValue()!;

        const bankRequest = new BankRequestModel({
            type: req.type,
            ref: req.ref,
            requestId: cardRequest.RequestKey,
            actionUrl: cardRequest.PaymentUrl
        });

        const bankRequestSaved = await this.bankRequestRepo.save(bankRequest);
        if (bankRequestSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving bank request'));
        }

        return Result.ok({bankRequest});
    }
}