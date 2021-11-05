import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IGlobalRepo } from "../../../../administration/repo/globals/IGlobalRepo";
import { IEmployeeRepo } from "../../../../organizations/repo/employees/IEmployeeRepo";
import { IOrganizationRepo } from "../../../../organizations/repo/organizations/IOrganizationRepo";
import { IUser } from "../../../../users/models/User";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { TipsModel } from "../../../models/Tips";
import { IPurchaseRepo } from "../../../repo/purchases/IPurchaseRepo";
import { ITipsRepo } from "../../../repo/tips/ITipsRepo";
import { ITipsValidationService } from "../../../services/tips/tipsValidationService/ITipsValidationService";
import { CreatePaymentUseCase } from "../../payments/createPayment/CreatePaymentUseCase";
import { SendTipsDTO } from "./SendTipsDTO";
import { sendTipsErrors } from "./sendTipsErrors";

export class SendTipsUseCase implements IUseCase<SendTipsDTO.Request, SendTipsDTO.Response> {
    private tipsRepo: ITipsRepo;
    private userRepo: IUserRepo;
    private employeeRepo: IEmployeeRepo;
    private organizationRepo: IOrganizationRepo;
    private createPaymentUseCase: CreatePaymentUseCase;
    private tipsValidationService: ITipsValidationService;
    private globalRepo: IGlobalRepo;
    private purchaseRepo: IPurchaseRepo;

    public errors = sendTipsErrors;

    constructor(
        tipsRepo: ITipsRepo, 
        userRepo: IUserRepo, 
        employeeRepo: IEmployeeRepo, 
        tipsValidationService: ITipsValidationService, 
        createPaymentUseCase: CreatePaymentUseCase, 
        organizationRepo: IOrganizationRepo,
        globalRepo: IGlobalRepo,
        purchaseRepo: IPurchaseRepo
    ) {
        this.tipsRepo = tipsRepo;
        this.userRepo = userRepo;
        this.employeeRepo = employeeRepo;
        this.createPaymentUseCase = createPaymentUseCase;
        this.tipsValidationService = tipsValidationService;
        this.organizationRepo = organizationRepo;
        this.globalRepo = globalRepo;
        this.purchaseRepo = purchaseRepo;
    }

    public async execute(req: SendTipsDTO.Request): Promise<SendTipsDTO.Response> {
        const valid = this.tipsValidationService.sendTipsData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const globalGotten = await this.globalRepo.getGlobal();
        if (globalGotten.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting global'));
        }

        const global = globalGotten.getValue()!;

        if (req.sum < global.tipsMinimalAmount) {
            return Result.fail(UseCaseError.create('c', 'sum is less than tips\' minimal amount allowed'));
        }

        let user: IUser;

        if (req.userId) {
            const userFound = await this.userRepo.findById(req.userId);
            if (userFound.isFailure) {
                return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
            }

            user = userFound.getValue()!;
        }

        const userCashierFound = await this.userRepo.findById(req.cashierUserId);
        if (userCashierFound.isFailure) {
            return Result.fail(userCashierFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user cashier') : UseCaseError.create('m'));
        }

        const userCashier = userCashierFound.getValue()!;

        const employeeFound = await this.employeeRepo.findByUserAndDisabledAndRole(userCashier._id.toString(), false, 'cashier');
        if (employeeFound.isFailure) {
            return Result.fail(UseCaseError.create('c', 'User is not cashier'));
        }

        const employee = employeeFound.getValue()!;

        const purchaseFound = await this.purchaseRepo.findById(req.purchaseId);
        if (purchaseFound.isFailure) {
            return Result.fail(purchaseFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding purchase') : UseCaseError.create('s'));
        }

        const purchase = purchaseFound.getValue()!;

        const organizationFound = await this.organizationRepo.findById(purchase.organization.toString());
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
        }

        const organization = organizationFound.getValue()!;

        if (!organization.tips) {
            return Result.fail(UseCaseError.create('c', 'Organization employees are not allowed to receive tips'));
        }

        const tips = new TipsModel({
            sum: req.sum,
            to: userCashier._id.toString(),
            from: user! ? user!._id.toString() : undefined,
            organization: employee.organization.toString(),
            processing: true,
            purchase: req.purchaseId
        }); 

        const tipsSaved = await this.tipsRepo.save(tips);
        if (tipsSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving tips'));
        }

        const paymentCreated = await this.createPaymentUseCase.execute({
            currency: 'rub',
            ref: tips._id.toString(),
            sum: tips.sum,
            type: 'tips',
            usedPoints: 0,
            shopId: '',
            safe: true
        });

        if (paymentCreated.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon creating payment'));
        }

        const payment = paymentCreated.getValue()!.payment;

        return Result.ok({payment});
    }
}