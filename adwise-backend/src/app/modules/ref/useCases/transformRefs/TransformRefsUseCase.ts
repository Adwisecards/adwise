import { IUseCase } from "../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../core/models/Result";
import { UseCaseError } from "../../../../core/models/UseCaseError";
import { timeService } from "../../../../services/timeService";
import { IContactRepo } from "../../../contacts/repo/contacts/IContactRepo";
import { IPurchaseRepo } from "../../../finance/repo/purchases/IPurchaseRepo";
import { ISubscriptionRepo } from "../../../finance/repo/subscriptions/ISubscriptionRepo";
import { ICouponRepo } from "../../../organizations/repo/coupons/ICouponRepo";
import { IInvitationRepo } from "../../../organizations/repo/invitations/IInvitationRepo";
import { IOrganizationRepo } from "../../../organizations/repo/organizations/IOrganizationRepo";
import { IProductRepo } from "../../../organizations/repo/products/IProductRepo";
import { IUserRepo } from "../../../users/repo/users/IUserRepo";
import { IRef } from "../../models/Ref";
import { IRefRepo } from "../../repo/IRefRepo";
import { CreateRefUseCase } from "../createRef/CreateRefUseCase";
import { TransformRefsDTO } from "./TransformRefsDTO";
import { transformRefsErrors } from "./transformRefsErrors";

export interface IRefObjectOne {
    ref: IRef;
};

export interface IRefObjectTwo {
    requestRef: IRef;
};

export type IRefObject = IRefObjectOne | IRefObjectTwo;

export class TransformRefsUseCase implements IUseCase<TransformRefsDTO.Request, TransformRefsDTO.Response> {
    private refRepo: IRefRepo;
    private organizationRepo: IOrganizationRepo;
    private contactRepo: IContactRepo;
    private userRepo: IUserRepo;
    private subscriptionRepo: ISubscriptionRepo;
    private couponRepo: ICouponRepo;
    private purchaseRepo: IPurchaseRepo;
    private invitationRepo: IInvitationRepo;
    private productRepo: IProductRepo;
    private createRefUseCase: CreateRefUseCase;

    public errors = transformRefsErrors;

    constructor(
        refRepo: IRefRepo, 
        organizationRepo: IOrganizationRepo, 
        contactRepo: IContactRepo, 
        userRepo: IUserRepo, 
        subscriptionRepo: ISubscriptionRepo, 
        couponRepo: ICouponRepo, 
        purchaseRepo: IPurchaseRepo, 
        invitationRepo: IInvitationRepo, 
        productRepo: IProductRepo,
        createRefUseCase: CreateRefUseCase
    ) {
        this.refRepo = refRepo;
        this.organizationRepo = organizationRepo;
        this.contactRepo = contactRepo;
        this.userRepo = userRepo;
        this.subscriptionRepo = subscriptionRepo;
        this.couponRepo = couponRepo;
        this.purchaseRepo = purchaseRepo;
        this.invitationRepo = invitationRepo;
        this.productRepo = productRepo;
        this.createRefUseCase = createRefUseCase;
    }

    public async execute(_: TransformRefsDTO.Request): Promise<TransformRefsDTO.Response> {
        const refsFound = await this.refRepo.getAll();
        if (refsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting refs'));
        }

        const refs = refsFound.getValue()!;

        let total = 6600;
        let i = 0;
        for (let ref of refs) {
            console.log(ref._id, i, (i / (total / 100)).toFixed(2)+'%');
            const refObject = await this.resolveRefObject(ref);
            if (!refObject) {
                await this.refRepo.deleteById(ref._id);
                continue;
            }

            const refCreated = await this.createRefUseCase.execute({
                mode: ref.mode,
                ref: ref.ref.toString(),
                type: ref.type
            })

            if (refCreated.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon creating ref'));
            }

            await this.refRepo.deleteById(ref._id);

            ref = refCreated.getValue()!;

            // ref.setQRCode();

            if ((<any>refObject).requestRef) {
                (<any>refObject).requestRef = ref;
            } else {
                (<any>refObject).ref = ref;
            }

            const refSaved = await this.refRepo.save(ref);
            if (refSaved.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon saving ref'));
            }

            const refObjectSaved = await this.saveRefObject(refObject, ref);
            if (refObjectSaved.isFailure) {
                return Result.fail(refObjectSaved.getError());
            }
            
            i++;
        }

        return Result.ok({ids: []});
    }

    private async resolveRefObject(ref: IRef): Promise<IRefObject | null> {
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

    private async saveRefObject(refObject: IRefObject, ref: IRef): Promise<Result<string | null, UseCaseError | null>> {
        if (ref.type == 'ref' && ref.mode == 'user') {
            const userSaved = await this.userRepo.save(refObject as any);
            if (userSaved.isSuccess) {
                return Result.ok('');
            }

            return Result.fail(UseCaseError.create('a', 'Error upon saving'));

        } else if (ref.type == 'contact' || ref.mode == 'contact') {
            const contactSaved = await this.contactRepo.save(refObject as any);
            if (contactSaved.isSuccess) {
                return Result.ok('');
            }

            return Result.fail(UseCaseError.create('a', 'Error upon saving'));
        
        } else if (ref.type == 'subscription' && ref.mode == 'organization') {
            const organizationSaved = await this.organizationRepo.save(refObject as any);
            if (organizationSaved.isSuccess) {
                return Result.ok('');
            }

            return Result.fail(UseCaseError.create('a', 'Error upon saving'));
        
        } else if (ref.type == 'coupon' || ref.mode == 'coupon') {
            const couponSaved = await this.couponRepo.save(refObject as any);
            if (couponSaved.isSuccess) {
                return Result.ok('');
            }
        
            return Result.fail(UseCaseError.create('a', 'Error upon saving'));
        
        } else if (ref.type == 'purchase' || ref.mode == 'purchase') {
            (<any>refObject).coupon.ref.setQRCode();

            const purchaseSaved = await this.purchaseRepo.save(refObject as any);
            if (purchaseSaved.isSuccess) {
                return Result.ok('');
            }

            console.log(purchaseSaved.getError());

            return Result.fail(UseCaseError.create('a', 'Error upon saving'));
        
        } else if (ref.type == 'invitation' && ref.mode == 'organization') {
            const invitationSaved = await this.invitationRepo.save(refObject as any);
            if (invitationSaved.isSuccess) {
                return Result.ok('');
            }

            return Result.fail(UseCaseError.create('a', 'Error upon saving'));
        
        } else if (ref.type == 'product' || ref.mode == 'product') {
            const productSaved = await this.productRepo.save(refObject as any);
            if (productSaved.isSuccess) {
                return Result.ok('');
            }
        }

        return Result.fail(UseCaseError.create('a', 'Error upon saving'));
    }
}