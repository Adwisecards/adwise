import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IContactRepo } from "../../../../contacts/repo/contacts/IContactRepo";
import { IPurchaseRepo } from "../../../../finance/repo/purchases/IPurchaseRepo";
import { ICouponRepo } from "../../../../organizations/repo/coupons/ICouponRepo";
import { IInvitationRepo } from "../../../../organizations/repo/invitations/IInvitationRepo";
import { IOrganizationRepo } from "../../../../organizations/repo/organizations/IOrganizationRepo";
import { IProductRepo } from "../../../../organizations/repo/products/IProductRepo";
import { IRef } from "../../../../ref/models/Ref";
import { IRefRepo } from "../../../../ref/repo/IRefRepo";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IAdministrationValidationService } from "../../../services/administrationValidationService/IAdministrationValidationService";
import { FindAllRefsDTO } from "./FindAllRefsDTO";
import { findAllRefsErrors } from "./findAllRefsErrors";

interface IPopulatedRef extends Omit<IRef, 'ref'> {
    ref: IRefObject | IRequestRefObject;
};

interface IRefObject {
    ref: IRef;
};

interface IRequestRefObject {
    requestRef: IRef;
};

export class FindAllRefsUseCase implements IUseCase<FindAllRefsDTO.Request, FindAllRefsDTO.Response> {
    private refRepo: IRefRepo;
    private userRepo: IUserRepo;
    private couponRepo: ICouponRepo;
    private contactRepo: IContactRepo;
    private productRepo: IProductRepo;
    private purchaseRepo: IPurchaseRepo;
    private invitationRepo: IInvitationRepo;
    private organizationRepo: IOrganizationRepo;

    private administrationValidationService: IAdministrationValidationService;

    public errors = findAllRefsErrors;

    constructor(
        refRepo: IRefRepo,
        userRepo: IUserRepo,
        couponRepo: ICouponRepo,
        contactRepo: IContactRepo,
        productRepo: IProductRepo,
        purchaseRepo: IPurchaseRepo,
        invitationRepo: IInvitationRepo,
        organizationRepo: IOrganizationRepo,
        administrationValidationService: IAdministrationValidationService
    ) {
        this.refRepo = refRepo;
        this.userRepo = userRepo;
        this.couponRepo = couponRepo;
        this.contactRepo = contactRepo;
        this.productRepo = productRepo;
        this.purchaseRepo = purchaseRepo;
        this.invitationRepo = invitationRepo;
        this.organizationRepo = organizationRepo;
        this.administrationValidationService = administrationValidationService;
    }

    public async execute(req: FindAllRefsDTO.Request): Promise<FindAllRefsDTO.Response> {
        const valid = this.administrationValidationService.findData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const parameterNames: string[] = [];
        const parameterValues: string[] = [];

        for (const key in req) {
            if (key == 'sortBy' || key == 'order' || key == 'pageSize' || key == 'pageNumber') continue;
            
            parameterNames.push(key);
            parameterValues.push((<any>req)[key]);
        }

        const refsFound = await this.refRepo.search(parameterNames, parameterValues, req.sortBy, req.order, req.pageSize, req.pageNumber);
        if (refsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding refs'));
        }

        const refs = refsFound.getValue()!;

        const populatedRefs: IPopulatedRef[] = [];

        for (const ref of refs) {
            try {
                const refObject = await this.resolveRefObject(ref);
                if (!refObject) {
                    continue;
                }

                populatedRefs.push({
                    ...ref?.toObject(),
                    ref: refObject
                });
            } catch (ex) {
                console.log(ex);
            }
        }

        const countFound = await this.refRepo.count(parameterNames, parameterValues);
        if (countFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting count'));
        }

        const count = countFound.getValue()!;

        return Result.ok({refs: populatedRefs, count});
    }

    private async resolveRefObject(ref: IRef): Promise<IRefObject | IRequestRefObject | null> {
        // const refTypes = ['user', 'contact', 'organization', 'subscription', 'coupon', 'purchase', 'invitation', 'product'];
        
        if (ref.type == 'ref' && ref.mode == 'user') {
            const userFound = await this.userRepo.findById(ref.ref.toString());
            if (userFound.isSuccess) {
                return userFound.getValue()!;
            }

            return null;

        } else if (ref.type == 'contact' || ref.mode == 'contact') {
            const contactFound = await this.contactRepo.findById(ref.ref.toString());
            if (contactFound.isSuccess) {
                return contactFound.getValue()!;
            }

            return null;
        
        } else if (ref.type == 'subscription' && ref.mode == 'organization') {
            const organizationFound = await this.organizationRepo.findById(ref.ref.toString());
            if (organizationFound.isSuccess) {
                return organizationFound.getValue()!;
            }

            return null;
        
        } else if (ref.type == 'coupon' || ref.mode == 'coupon') {
            const couponFound = await this.couponRepo.findById(ref.ref.toString());
            if (couponFound.isSuccess) {
                return couponFound.getValue()!;
            }
        
            return null;
        
        } else if (ref.type == 'purchase' || ref.mode == 'purchase') {
            const purchaseFound = await this.purchaseRepo.findById(ref.ref.toString());
            if (purchaseFound.isSuccess) {
                return purchaseFound.getValue()!;
            }

            return null;
        
        } else if (ref.type == 'invitation' && ref.mode == 'organization') {
            const invitationFound = await this.invitationRepo.findById(ref.ref.toString());
            if (invitationFound.isSuccess) {
                return invitationFound.getValue()!;
            }

            return null;
        
        } else if (ref.type == 'product' || ref.mode == 'product') {
            const productFound = await this.productRepo.findById(ref.ref.toString());
            if (productFound.isSuccess) {
                return productFound.getValue()!;
            }
        }

        return null;
    }
}